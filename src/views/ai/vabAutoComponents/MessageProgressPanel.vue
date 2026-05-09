<template>
  <div class="message-progress-panel">
    <div class="progress-toolbar">
      <label class="detail-toggle">
        <input v-model="showDetails" type="checkbox" />
        <span>详情</span>
      </label>
      <span v-if="hiddenLogCount > 0" class="hidden-hint">{{ hiddenLogCount }} 条 log 已折叠</span>
      <span v-if="totalTokens > 0" class="total-tokens">{{ totalTokens.toLocaleString() }} tokens</span>
      <span v-if="totalDuration" class="total-duration">总耗时 {{ totalDuration }}</span>
    </div>
    <ul class="progress-list">
      <li v-for="(ev, idx) in visibleEvents" :key="idx" :class="['progress-item', `event-${ev.event}`]">
        <span class="event-tag">{{ ev.event }}</span>
        <span class="event-label">{{ describe(ev) }}</span>
        <span v-if="stepDelta(idx)" class="event-delta">{{ stepDelta(idx) }}</span>
      </li>
      <li v-if="loading" class="progress-item is-loading">
        <span class="event-label">加载中...</span>
      </li>
      <li v-else-if="events.length === 0" class="progress-item is-empty">
        <span class="event-label">无过程数据</span>
      </li>
      <li v-else-if="visibleEvents.length === 0" class="progress-item is-empty">
        <span class="event-label">暂无关键步骤（点击「详情」查看完整 timeline）</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LangFlowProgressEvent } from '/@/type/ai/chat'

const props = defineProps<{
  events: LangFlowProgressEvent[]
  loading?: boolean
}>()

// 默认折叠 log 噪声，用户可主动展开看完整 timeline
const showDetails = ref(false)

// LangFlow 节点 id 形如 "ComponentType-<6位随机后缀>"，end_vertex 事件不带顶层 display_name，
// 这里取 id 的 - 前缀作为类型名展示（例：UnifiedWebSearch-APzw9 → UnifiedWebSearch）。
const extractVertexTypeName = (rawId: string): string => {
  if (!rawId) return ''
  const dashIdx = rawId.indexOf('-')
  return dashIdx > 0 ? rawId.slice(0, dashIdx) : rawId
}

// 在 outputs 子树中递归查找首个非空的 metadata.display_name —— LangFlow 把
// 节点调用的工具/子组件名挂在 outputs.<port>.message[i].metadata.display_name 之类的位置。
// 实测路径示例：
//   outputs.component_as_tool.message[0].metadata.display_name = "perform_search"
//   outputs.component_as_tool.raw[0].metadata.display_name = "4_2_Reddit_Research_tool"
const extractOutputsDisplayName = (node: any): string => {
  if (!node || typeof node !== 'object') return ''
  // 直接命中：当前节点就是一个 {metadata: {display_name}} 结构
  const dn = node?.metadata?.display_name
  if (typeof dn === 'string' && dn) return dn
  // 递归
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = extractOutputsDisplayName(item)
      if (found) return found
    }
  } else {
    for (const key of Object.keys(node)) {
      const found = extractOutputsDisplayName(node[key])
      if (found) return found
    }
  }
  return ''
}

/**
 * 把 LangFlow 节点 token_usage 字段格式化为可读字符串。
 *
 * LangFlow / LangChain 标准结构：
 *   { prompt_tokens, completion_tokens, total_tokens }
 * 也兼容驼峰命名 / OpenAI input_tokens/output_tokens。
 *
 * @returns "1234 tokens" / "123+456 tokens" / "" (无可用值)
 */
const formatTokenUsage = (usage: any): string => {
  if (!usage || typeof usage !== 'object') return ''
  const total = usage.total_tokens ?? usage.totalTokens
  const prompt = usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens
  const completion = usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens
  if (typeof total === 'number' && total > 0) return `${total.toLocaleString()} tokens`
  if (typeof prompt === 'number' && typeof completion === 'number') {
    return `${prompt.toLocaleString()}+${completion.toLocaleString()} tokens`
  }
  return ''
}

/**
 * 从单个 end_vertex 事件中提取 token_usage 数值，用于 totalTokens 累加。
 * 取 total_tokens；若缺失则用 prompt + completion；都没有返回 0。
 */
const extractTokenCount = (usage: any): number => {
  if (!usage || typeof usage !== 'object') return 0
  const total = usage.total_tokens ?? usage.totalTokens
  if (typeof total === 'number' && total > 0) return total
  const prompt = usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens ?? 0
  const completion = usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens ?? 0
  return (typeof prompt === 'number' ? prompt : 0) + (typeof completion === 'number' ? completion : 0)
}

// 按事件类型给出人类可读描述。无描述（返回空串）的事件由 visibleEvents 过滤掉。
const labelMap: Record<string, (data: any) => string> = {
  vertices_sorted: (d) => `规划 ${d?.to_run?.length ?? 0} 个节点`,
  build_start: () => '开始执行',
  end_vertex: (d) => {
    const typeName = extractVertexTypeName(d?.build_data?.id ?? '')
    const displayName = extractOutputsDisplayName(d?.build_data?.data?.outputs)
    const tokens = formatTokenUsage(d?.build_data?.data?.token_usage)
    // 两者都有且不重复 → "类型名 → 工具/子组件名"；否则取其一
    let main: string
    if (typeName && displayName && typeName !== displayName) {
      main = `节点完成：${typeName} → ${displayName}`
    } else {
      main = `节点完成：${displayName || typeName || '未知节点'}`
    }
    return tokens ? `${main}（${tokens}）` : main
  },
  log: (d) => d?.name ?? '步骤',
  add_message: (d) => {
    const sender = d?.data?.sender
    const state = d?.data?.properties?.state
    if (sender === 'User' && state === 'complete') return '' // 用户消息已显示在主聊天框
    if (sender === 'Machine' && state === 'partial') return 'AI 正在思考...'
    if (sender === 'Machine' && state === 'complete') return '' // 已通过 chunk 流出
    return ''
  },
  end: () => '执行完成',
  error: (d) => `错误：${d?.message ?? '未知'}`,
}

const describe = (ev: LangFlowProgressEvent): string => labelMap[ev.event]?.(ev.data) ?? ''

// 过滤：(1) 隐藏空 label 行；(2) 默认隐藏 log 事件
const visibleEvents = computed(() =>
  props.events.filter((ev) => {
    if (!describe(ev)) return false
    if (ev.event === 'log' && !showDetails.value) return false
    return true
  }),
)

// 折叠提示：当前折了多少条 log
const hiddenLogCount = computed(() =>
  showDetails.value ? 0 : props.events.filter((ev) => ev.event === 'log').length,
)

/**
 * 自适应耗时格式化：
 * - < 1s: "320ms"
 * - < 60s: "5.4s"
 * - >= 60s: "1m 23s"
 */
const formatDuration = (ms?: number): string => {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return ''
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

// 总耗时：第一个有 receivedAt 的事件 → 最后一个有 receivedAt 的事件
const totalDuration = computed(() => {
  const first = props.events.find((e) => e.receivedAt)?.receivedAt
  const last = [...props.events].reverse().find((e) => e.receivedAt)?.receivedAt
  if (!first || !last || last <= first) return ''
  return formatDuration(last - first)
})

// 总 tokens：所有 end_vertex 事件 token_usage 累加（仅 LLM/Agent 节点会报）
const totalTokens = computed(() => {
  let sum = 0
  for (const ev of props.events) {
    if (ev.event !== 'end_vertex') continue
    sum += extractTokenCount(ev.data?.build_data?.data?.token_usage)
  }
  return sum
})

// 自上一条 visible 事件的间隔（首条无）
const stepDelta = (idx: number): string => {
  if (idx === 0) return ''
  const cur = visibleEvents.value[idx]?.receivedAt
  const prev = visibleEvents.value[idx - 1]?.receivedAt
  if (!cur || !prev || cur <= prev) return ''
  return `+${formatDuration(cur - prev)}`
}
</script>

<style scoped lang="scss">
.message-progress-panel {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f6f8fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  max-height: 240px;
  overflow-y: auto;
}

.progress-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #e4e7ed;
}

.detail-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  user-select: none;

  input {
    cursor: pointer;
  }
}

.hidden-hint {
  font-size: 12px;
  color: #c0c4cc;
}

.total-duration,
.total-tokens {
  margin-left: auto;
  font-size: 12px;
  color: #c0c4cc;
  font-variant-numeric: tabular-nums;
}

/* 当 tokens 和 duration 都存在时，第一个 margin-left:auto 把 tokens 推到右侧，
   duration 紧贴 tokens 后面（不再单独推） */
.total-tokens + .total-duration {
  margin-left: 0;
}

.progress-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.progress-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 0;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
}

.event-tag {
  flex: 0 0 auto;
  display: inline-block;
  padding: 1px 6px;
  font-family: monospace;
  font-size: 11px;
  color: #909399;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}

.event-label {
  flex: 1 1 auto;
  word-break: break-word;
}

.event-delta {
  flex: 0 0 auto;
  margin-left: 6px;
  font-size: 11px;
  color: #c0c4cc;
  font-variant-numeric: tabular-nums;
}

.progress-item.event-end_vertex .event-label,
.progress-item.event-end .event-label {
  color: #67c23a;
}

.progress-item.event-error .event-label {
  color: #f56c6c;
}

.progress-item.is-loading,
.progress-item.is-empty {
  color: #909399;
  font-style: italic;
}
</style>

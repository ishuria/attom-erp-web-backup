<template>
  <div class="message-progress-panel">
    <div v-if="totalDuration" class="progress-toolbar">
      <span class="total-duration">总耗时 {{ totalDuration }}</span>
    </div>
    <ul class="progress-list">
      <li
        v-for="(s, idx) in steps"
        :key="idx"
        :class="['progress-item', `step-${s.stepType}`, `status-${s.stepStatus}`]"
      >
        <div class="progress-head">
          <span class="step-icon">{{ stepIcon(s) }}</span>
          <span class="event-label">{{ s.summary || fallbackSummary(s) }}</span>
          <span v-if="stepDelta(idx)" class="event-delta">{{ stepDelta(idx) }}</span>
          <button
            v-if="hasDetail(s)"
            type="button"
            class="detail-toggle"
            @click="toggleDetail(idx)"
          >
            {{ expandedDetailMap[idx] ? '▼ 详情' : '▶ 详情' }}
          </button>
        </div>
        <div v-if="expandedDetailMap[idx] && hasDetail(s)" class="step-detail">
          <div v-if="availableTabs(s).length > 1" class="step-detail-tabs">
            <span
              v-for="tab in availableTabs(s)"
              :key="tab.key"
              :class="['detail-tab', { active: currentTabKey(s, idx) === tab.key }]"
              @click="activeTabMap[idx] = tab.key"
            >{{ tab.label }}</span>
          </div>
          <div class="step-detail-text">{{ currentTabText(s, idx) }}</div>
        </div>
        <div v-if="s.errorMessage" class="event-error">{{ s.errorMessage }}</div>
      </li>
      <li v-if="loading" class="progress-item is-loading">
        <span class="event-label">加载中...</span>
      </li>
      <li v-else-if="steps.length === 0" class="progress-item is-empty">
        <span class="event-label">无思考过程数据</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { AiStreamStepEvent } from '/@/type/ai/chat'

const props = defineProps<{
  steps: AiStreamStepEvent[]
  loading?: boolean
}>()

type DetailTabKey = 'inputs' | 'outputs'

// 详情展开状态（key = idx）
const expandedDetailMap = reactive<Record<number, boolean>>({})
// 当前激活 Tab
const activeTabMap = reactive<Record<number, DetailTabKey>>({})

const hasDetail = (s: AiStreamStepEvent): boolean => Boolean(s.stepInputs || s.stepOutputs)

const availableTabs = (s: AiStreamStepEvent): { key: DetailTabKey; label: string }[] => {
  const tabs: { key: DetailTabKey; label: string }[] = []
  if (s.stepInputs) tabs.push({ key: 'inputs', label: '输入' })
  if (s.stepOutputs) tabs.push({ key: 'outputs', label: '输出' })
  return tabs
}

// 默认 Tab：有 outputs 优先 outputs（结果通常更接近用户关注的"AI 干了什么"）
const currentTabKey = (s: AiStreamStepEvent, idx: number): DetailTabKey => {
  return activeTabMap[idx] || (s.stepOutputs ? 'outputs' : 'inputs')
}

const toggleDetail = (idx: number) => {
  expandedDetailMap[idx] = !expandedDetailMap[idx]
  if (expandedDetailMap[idx] && !activeTabMap[idx]) {
    activeTabMap[idx] = props.steps[idx].stepOutputs ? 'outputs' : 'inputs'
  }
}

const currentTabText = (s: AiStreamStepEvent, idx: number): string => {
  const key = currentTabKey(s, idx)
  return extractDisplayText(key === 'outputs' ? s.stepOutputs : s.stepInputs)
}

/**
 * 从 JSON / 字符串中提取可读文本。
 *
 * - 字符串（非 JSON）→ 原文
 * - JSON 字符串包了引号 → 解开
 * - 对象 → 递归找首个 text/content/message/output/result/answer 字段
 * - 都找不到 → fallback 到 JSON.stringify 缩进（保留可读性）
 */
const extractDisplayText = (raw?: string): string => {
  if (!raw) return ''
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return raw
  }
  if (typeof value === 'string') return value
  if (value == null) return ''
  const candidateKeys = ['text', 'content', 'message', 'output', 'result', 'answer']
  const visit = (node: unknown, depth = 0): string | null => {
    if (depth > 4 || node == null) return null
    if (typeof node === 'string') return node
    if (typeof node !== 'object') return String(node)
    const obj = node as Record<string, unknown>
    for (const key of candidateKeys) {
      const v = obj[key]
      if (typeof v === 'string' && v) return v
      if (v && typeof v === 'object') {
        const found = visit(v, depth + 1)
        if (found) return found
      }
    }
    return null
  }
  const found = visit(value)
  return found ?? JSON.stringify(value, null, 2)
}

const stepIcon = (s: AiStreamStepEvent): string => {
  if (s.stepType === 'error') return '💥'
  if (s.stepType === 'tool') {
    return s.stepStatus === 'error' ? '⚠️' : '🔧'
  }
  // vertex
  if (s.stepStatus === 'running') return '🔍'
  if (s.stepStatus === 'error') return '❌'
  return '✅'
}

// summary 兜底：后端 summary 缺失时按名字 + 状态拼出基本文案
const fallbackSummary = (s: AiStreamStepEvent): string => {
  const name = s.vertexName || s.vertexId || '未知节点'
  const tool = s.toolName || '未知工具'
  if (s.stepType === 'error') return `流程异常: ${s.errorMessage || ''}`
  if (s.stepType === 'tool') {
    if (s.stepStatus === 'error') return `工具 ${tool} 调用失败`
    return s.durationMs != null ? `已调用工具 ${tool} (${s.durationMs}ms)` : `已调用工具 ${tool}`
  }
  if (s.stepStatus === 'running') return `正在执行 ${name}...`
  if (s.stepStatus === 'error') return `${name} 执行失败`
  return s.durationMs != null ? `${name} 已完成 (${(s.durationMs / 1000).toFixed(1)}s)` : `${name} 已完成`
}

const formatDuration = (ms?: number): string => {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return ''
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

// 取第一条与最后一条 receivedAt 的差作为总耗时
const totalDuration = computed(() => {
  const arr = props.steps
  const first = arr.find((s) => s.receivedAt)?.receivedAt
  const last = [...arr].reverse().find((s) => s.receivedAt)?.receivedAt
  if (!first || !last || last <= first) return ''
  return formatDuration(last - first)
})

// 同步显示相邻步骤的时间差，便于观察单步耗时
const stepDelta = (idx: number): string => {
  if (idx === 0) return ''
  const cur = props.steps[idx]?.receivedAt
  const prev = props.steps[idx - 1]?.receivedAt
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
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #e4e7ed;
}

.total-duration {
  margin-left: auto;
  font-size: 12px;
  color: #c0c4cc;
  font-variant-numeric: tabular-nums;
}

.progress-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.progress-item {
  padding: 3px 0;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
}

.progress-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.step-icon {
  flex: 0 0 auto;
  font-size: 13px;
  line-height: 1;
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

.event-error {
  margin-top: 2px;
  padding: 4px 8px;
  font-size: 11px;
  color: #f56c6c;
  background: #fef0f0;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-word;
}

.detail-toggle {
  flex: 0 0 auto;
  padding: 1px 6px;
  font-family: monospace;
  font-size: 11px;
  color: #409eff;
  background: transparent;
  border: 1px solid #d9ecff;
  border-radius: 3px;
  cursor: pointer;
  line-height: 16px;

  &:hover {
    background: #ecf5ff;
    border-color: #409eff;
  }
}

.step-detail {
  margin: 4px 0 6px 24px;
  padding: 6px 10px;
  background: #fafbfc;
  border-left: 3px solid #d9ecff;
  border-radius: 3px;
}

.step-detail-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid #ebeef5;
}

.detail-tab {
  padding: 2px 0;
  font-size: 11px;
  color: #909399;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  user-select: none;

  &.active {
    color: #409eff;
    border-bottom-color: #409eff;
  }

  &:hover:not(.active) {
    color: #606266;
  }
}

.step-detail-text {
  max-height: 240px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.55;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
}

.progress-item.status-success .event-label {
  color: #67c23a;
}

.progress-item.status-error .event-label,
.progress-item.step-error .event-label {
  color: #f56c6c;
}

.progress-item.status-running .event-label {
  color: #409eff;
}

.progress-item.is-loading,
.progress-item.is-empty {
  color: #909399;
  font-style: italic;
}
</style>

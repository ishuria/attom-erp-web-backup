<template>
  <div class="message-progress-panel">
    <div v-if="totalDuration" class="progress-toolbar">
      <span class="total-duration">{{ totalDuration }}</span>
    </div>
    <ul class="progress-list">
      <li
        v-for="(s, idx) in steps"
        :key="idx"
        :class="['step-card', `step-${s.stepType}`, `status-${s.stepStatus}`, { 'is-expanded': expandedDetailMap[idx] }]"
      >
        <div
          class="step-head"
          :class="{ clickable: hasDetail(s) }"
          @click="hasDetail(s) && toggleDetail(idx)"
        >
          <span class="step-icon">{{ stepIcon(s) }}</span>
          <span class="step-title">{{ stepTitle(s) }}</span>
          <span v-if="s.durationMs != null" class="step-duration">{{ formatDuration(s.durationMs) }}</span>
          <span v-else-if="s.stepStatus === 'running'" class="step-duration running-dot">运行中</span>
          <span v-if="hasDetail(s)" class="step-chevron">{{ expandedDetailMap[idx] ? '⌃' : '⌄' }}</span>
        </div>

        <div v-if="expandedDetailMap[idx] && hasDetail(s)" class="step-body">
          <div v-if="availableTabs(s).length > 1" class="step-tabs">
            <span
              v-for="tab in availableTabs(s)"
              :key="tab.key"
              :class="['step-tab', { active: currentTabKey(s, idx) === tab.key }]"
              @click.stop="activeTabMap[idx] = tab.key"
            >{{ tab.label }}</span>
          </div>
          <div v-else class="step-section-label">{{ availableTabs(s)[0]?.label }}</div>
          <div class="step-content-box">
            <template v-for="(block, bi) in currentTabBlocks(s, idx)" :key="bi">
              <div v-if="block.type === 'text'" class="step-content-text">{{ block.text }}</div>
              <div v-else class="step-content-table-wrap">
                <table class="step-content-table">
                  <thead>
                    <tr>
                      <th v-for="(col, ci) in block.headers" :key="ci">{{ col }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in block.rows" :key="ri">
                      <td v-for="(cell, ci) in row" :key="ci">
                        <el-image
                          v-if="isImageUrl(cell)"
                          :src="cell"
                          :preview-src-list="[cell]"
                          :preview-teleported="true"
                          fit="contain"
                          lazy
                          class="step-cell-image"
                        >
                          <template #error>
                            <span class="step-cell-image-broken">🖼 加载失败</span>
                          </template>
                        </el-image>
                        <a
                          v-else-if="isHttpUrl(cell)"
                          :href="cell"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="step-cell-link"
                        >{{ cell }}</a>
                        <template v-else>{{ cell }}</template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>

        <div v-if="s.errorMessage" class="step-error">{{ s.errorMessage }}</div>
      </li>

      <li v-if="loading" class="step-card is-meta">
        <span class="step-icon">⏳</span>
        <span class="step-title">加载中...</span>
      </li>
      <li v-else-if="steps.length === 0" class="step-card is-meta">
        <span class="step-icon">💭</span>
        <span class="step-title">无思考过程数据</span>
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
  if (s.stepInputs) tabs.push({ key: 'inputs', label: 'Input' })
  if (s.stepOutputs) tabs.push({ key: 'outputs', label: 'Output' })
  return tabs
}

const currentTabKey = (s: AiStreamStepEvent, idx: number): DetailTabKey => {
  return activeTabMap[idx] || (s.stepOutputs ? 'outputs' : 'inputs')
}

const toggleDetail = (idx: number) => {
  expandedDetailMap[idx] = !expandedDetailMap[idx]
  if (expandedDetailMap[idx] && !activeTabMap[idx]) {
    activeTabMap[idx] = props.steps[idx].stepOutputs ? 'outputs' : 'inputs'
  }
}

const currentTabBlocks = (s: AiStreamStepEvent, idx: number): DisplayBlock[] => {
  const key = currentTabKey(s, idx)
  return extractDisplayBlocks(key === 'outputs' ? s.stepOutputs : s.stepInputs)
}

type DisplayBlock =
  | { type: 'text'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

/** 常见"包装层"字段：把对象/数组真正主体藏在这些 key 下 */
const PAYLOAD_KEYS = ['results', 'result', 'data', 'items', 'list', 'records', 'rows']

/**
 * 把 input/output 原始 JSON 拆成可渲染的块（表格 / 文本混合）。
 *
 * 表格优先识别：
 * - 数组 of 对象 → 列表型 table
 * - 单个对象 → 两列 key-value table（嵌套值用 yaml-like 缩进展示）
 * 其他情况 → yaml-like 文本块
 *
 * 特别处理：
 * - LangFlow 工具 output 经常是「JSON 字符串套字符串」，反复 parse 直到拿到对象/数组
 * - 单字段包装层 `{results: [...]}` / `{data: [...]}` → 自动解套到内部数组
 * - MCP 协议响应 `{content: [{type: 'text', text: '[{...}]'}]}` → 解开 content[0].text 内嵌 JSON
 */
const extractDisplayBlocks = (raw?: string): DisplayBlock[] => {
  if (!raw) return []
  const value = tryParseDeep(raw)
  if (value == null) return []
  if (typeof value === 'string') return [{ type: 'text', text: value }]

  // 先解套包装层
  const unwrapped = unwrapPayload(value)
  if (unwrapped == null) return []
  if (typeof unwrapped === 'string') return [{ type: 'text', text: unwrapped }]

  // 解套后再看是否还有主文本字段（如 agent 输出 message）
  const found = findMainText(unwrapped)
  if (found) {
    const inner = tryParseDeep(found)
    if (inner != null && typeof inner === 'object') {
      return blocksForValue(unwrapPayload(inner) ?? inner)
    }
    return [{ type: 'text', text: found }]
  }
  return blocksForValue(unwrapped)
}

/**
 * 递归解开常见的"包装层"，让 table 识别能拿到真正的主体数据。
 *
 * 三种被识别的包装形态：
 * 1) MCP 风格：`{content: [{type: 'text', text: '<JSON string>'}], ...}`
 *    → 取 content[0].text，再 JSON.parse 后继续解套
 * 2) 单数据字段：`{results: [...]}` / `{data: [...]}` / `{items: [...]}` 等
 *    → 直接返回那个数组
 * 3) 仅一个非噪音对象/数组字段的包装：`{xxx: [...]}` 单一字段
 *    → 返回该字段值
 *
 * 找不到包装就返回原值。
 */
const unwrapPayload = (value: unknown, depth = 0): unknown => {
  if (depth > 4) return value
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return value
  const obj = value as Record<string, unknown>

  // 1) MCP content blocks
  if (Array.isArray(obj.content) && obj.content.length > 0) {
    const first = obj.content[0] as Record<string, unknown> | undefined
    if (first && typeof first === 'object' && first.type === 'text' && typeof first.text === 'string') {
      const inner = tryParseDeep(first.text)
      if (inner != null) return unwrapPayload(inner, depth + 1)
    }
  }

  // 2) 已知"主数据字段"优先
  for (const key of PAYLOAD_KEYS) {
    const v = obj[key]
    if (Array.isArray(v) && v.length > 0) return v
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0) {
      return unwrapPayload(v, depth + 1)
    }
  }

  // 3) 仅一个非噪音字段且值是对象/数组 → 解套
  const nonNoiseEntries = Object.entries(obj).filter(
    ([k, v]) => !NOISE_KEYS.has(k) && v != null && v !== '',
  )
  if (nonNoiseEntries.length === 1) {
    const [, only] = nonNoiseEntries[0]
    if (Array.isArray(only) && only.length > 0) return only
    if (only && typeof only === 'object') return unwrapPayload(only, depth + 1)
  }

  return value
}

/**
 * 反复 JSON.parse 直到拿到非字符串值。
 * 用于 LangFlow 工具 output 这种 `"{\"asin\":\"B08X\"}"` 套娃字符串。
 */
const tryParseDeep = (raw: string, maxDepth = 3): unknown => {
  let cur: unknown = raw
  for (let i = 0; i < maxDepth; i++) {
    if (typeof cur !== 'string') return cur
    const trimmed = cur.trim()
    if (!trimmed) return cur
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    const looksJson =
      (first === '{' && last === '}')
      || (first === '[' && last === ']')
      || (first === '"' && last === '"')
    if (!looksJson) return cur
    try {
      cur = JSON.parse(trimmed)
    } catch {
      return cur
    }
  }
  return cur
}

const blocksForValue = (value: unknown): DisplayBlock[] => {
  if (Array.isArray(value)) {
    if (value.length === 0) return [{ type: 'text', text: '(空)' }]
    if (isUniformObjectArray(value)) {
      return [arrayToTable(value as Record<string, unknown>[])]
    }
    // 纯标量数组 → 文本列表
    return [{ type: 'text', text: toReadableYaml(value, 0) }]
  }
  if (value && typeof value === 'object') {
    // 单对象一律走 key-value 两列表；嵌套子对象在单元格里以 yaml-like 缩进展示
    return [objectToTable(value as Record<string, unknown>)]
  }
  if (typeof value === 'string') return [{ type: 'text', text: value }]
  return [{ type: 'text', text: toReadableYaml(value, 0) }]
}

const isUniformObjectArray = (arr: unknown[]): boolean => {
  if (arr.length === 0) return false
  return arr.every(
    (item) => item != null && typeof item === 'object' && !Array.isArray(item),
  )
}

const objectToTable = (obj: Record<string, unknown>): DisplayBlock => {
  const rows: string[][] = []
  for (const [k, v] of Object.entries(obj)) {
    if (NOISE_KEYS.has(k)) continue
    if (v == null || v === '') continue
    let displayValue: string
    if (typeof v === 'object') {
      // 嵌套对象：递归先看是否能进一步解开 JSON 字符串
      const inner = typeof v === 'string' ? tryParseDeep(v as string) : v
      displayValue = toReadableYaml(inner, 0)
    } else {
      displayValue = String(v)
    }
    rows.push([humanizeKey(k), displayValue])
  }
  return { type: 'table', headers: ['字段', '值'], rows }
}

const arrayToTable = (arr: Record<string, unknown>[]): DisplayBlock => {
  // 收集所有 keys 的并集（保持首次出现顺序），过滤元数据噪音
  const keyOrder: string[] = []
  const seen = new Set<string>()
  for (const item of arr) {
    for (const k of Object.keys(item)) {
      if (NOISE_KEYS.has(k) || seen.has(k)) continue
      seen.add(k)
      keyOrder.push(k)
    }
  }
  // 列数过多时只取前 12 列（容器有横向滚动兜底）
  const keys = keyOrder.slice(0, 12)
  const headers = keys.map(humanizeKey)
  const rows = arr.map((item) => keys.map((k) => stringifyCell(item[k])))
  return { type: 'table', headers, rows }
}

const stringifyCell = (v: unknown): string => {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  // 嵌套对象 / 数组 → yaml-like 缩进，避免单元格显示 raw JSON
  return toReadableYaml(v, 0)
}

const IMAGE_EXT_RE = /\.(?:jpe?g|png|gif|webp|svg|bmp|avif|ico)(?:\?[^#]*)?(?:#.*)?$/i

/**
 * 判断字符串是否为图片资源 URL（用于 table cell 渲染时把图片字段显示成缩略图）。
 *
 * 命中条件：
 * - data:image/... 内联 base64 图片
 * - http(s) URL 且 pathname 以常见图片扩展名结尾（jpg/png/gif/webp/svg/bmp/avif/ico）
 *
 * 不命中无扩展名的 CDN URL（如 `https://cdn.x.com/i/abc123`）—— 无法 sync 判断，
 * 留作文本展示避免误判。
 */
const isImageUrl = (text: unknown): boolean => {
  if (typeof text !== 'string') return false
  const trimmed = text.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('data:image/')) return true
  if (!/^https?:\/\//i.test(trimmed)) return false
  try {
    const url = new URL(trimmed)
    return IMAGE_EXT_RE.test(url.pathname)
  } catch {
    return false
  }
}

/**
 * 判断 cell 是否是 http(s) URL（且不是图片 —— 图片走 isImageUrl 分支）。
 *
 * 要求整段字符串本身就是一个完整 URL，单元格里夹带文本的 URL 不命中（避免误判
 * "查看链接: https://..." 这类描述性文本）。
 */
const isHttpUrl = (text: unknown): boolean => {
  if (typeof text !== 'string') return false
  const trimmed = text.trim()
  if (!trimmed) return false
  if (!/^https?:\/\/\S+$/i.test(trimmed)) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// 主要文本字段（LangChain message / agent output 常见结构里有 text / content / message 等正文）
const TEXT_FIELD_KEYS = ['text', 'content', 'message', 'output', 'result', 'answer']

// 元数据噪音字段：抽到主文本时可以忽略这些字段判断"是否只有一个主字段"
const NOISE_KEYS = new Set([
  'type', 'additional_kwargs', 'response_metadata', 'tool_calls', 'invalid_tool_calls',
  'usage_metadata', 'id', 'name', 'role', 'sender', 'sender_name', 'timestamp',
  'created_at', 'flow_id', 'session_id',
])

/**
 * 递归找首个"显著主文本字段"。
 * 例如 LangChain HumanMessage / AIMessage 通常长这样：
 *   { type: "human", content: "查询亚马逊 B08X1234", additional_kwargs: {} }
 * 这种情况下用户想看的就是 content 字段，不是整个对象。
 */
const findMainText = (node: unknown, depth = 0): string | null => {
  if (depth > 4 || node == null) return null
  if (typeof node === 'string') return node && node.length > 0 ? node : null
  if (typeof node !== 'object') return null
  const obj = node as Record<string, unknown>
  // 1) 直接命中主文本字段
  for (const key of TEXT_FIELD_KEYS) {
    const v = obj[key]
    if (typeof v === 'string' && v) return v
  }
  // 2) 嵌套对象里再找一层
  for (const key of TEXT_FIELD_KEYS) {
    const v = obj[key]
    if (v && typeof v === 'object') {
      const found = findMainText(v, depth + 1)
      if (found) return found
    }
  }
  return null
}

/** snake_case / camelCase → Title Case（asin → Asin, user_id → User Id） */
const humanizeKey = (key: string): string => {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

/** 把 JSON 转成 yaml-like 文本，无引号花括号，缩进表达层级 */
const toReadableYaml = (value: unknown, depth: number): string => {
  const indent = '  '.repeat(depth)
  if (value == null) return ''
  if (typeof value === 'string') {
    // 多行字符串：每行加缩进
    if (value.includes('\n')) {
      return value
        .split('\n')
        .map((line, i) => (i === 0 ? line : indent + line))
        .join('\n')
    }
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '(空)'
    return value
      .map((item) => {
        if (item && typeof item === 'object') {
          const sub = toReadableYaml(item, depth + 1)
          return `${indent}- ${sub.replace(/^\s+/, '')}`
        }
        return `${indent}- ${toReadableYaml(item, depth)}`
      })
      .join('\n')
  }
  if (typeof value === 'object') {
    // 过滤掉元数据噪音字段（让运营看的内容更聚焦）
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([k, v]) => !NOISE_KEYS.has(k) && v !== null && v !== undefined && v !== '')
    if (entries.length === 0) return '(空)'
    return entries
      .map(([k, v]) => {
        const label = humanizeKey(k)
        if (Array.isArray(v) || (v && typeof v === 'object')) {
          const sub = toReadableYaml(v, depth + 1)
          if (sub.includes('\n') || sub.length > 60) {
            return `${indent}${label}:\n${sub}`
          }
          return `${indent}${label}: ${sub}`
        }
        return `${indent}${label}: ${v}`
      })
      .join('\n')
  }
  return String(value)
}

/**
 * 卡片头部主标题：
 * - tool 步骤：工具名（粗体）
 * - vertex 步骤：display_name（粗体）
 * - error 步骤：「流程异常」
 * 状态信息通过左侧图标 + 卡片左边色条体现，无须重复在标题里写状态。
 */
const stepTitle = (s: AiStreamStepEvent): string => {
  if (s.stepType === 'error') return '流程异常'
  if (s.stepType === 'tool') return s.toolName || '未知工具'
  return s.vertexName || s.vertexId || '未知节点'
}

const stepIcon = (s: AiStreamStepEvent): string => {
  if (s.stepType === 'error') return '💥'
  if (s.stepType === 'tool') {
    return s.stepStatus === 'error' ? '⚠️' : '🔧'
  }
  if (s.stepStatus === 'running') return '◐'
  if (s.stepStatus === 'error') return '✕'
  return '✓'
}

const formatDuration = (ms?: number): string => {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return ''
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

// 总耗时：步骤累计 durationMs（更准确），无 durationMs 时回退到 receivedAt 差值
const totalDuration = computed(() => {
  const arr = props.steps
  let totalMs = 0
  let anyDuration = false
  for (const s of arr) {
    if (typeof s.durationMs === 'number' && s.durationMs > 0) {
      totalMs += s.durationMs
      anyDuration = true
    }
  }
  if (anyDuration && totalMs > 0) return formatDuration(totalMs)
  const first = arr.find((s) => s.receivedAt)?.receivedAt
  const last = [...arr].reverse().find((s) => s.receivedAt)?.receivedAt
  if (!first || !last || last <= first) return ''
  return formatDuration(last - first)
})
</script>

<style scoped lang="scss">
.message-progress-panel {
  margin-top: 8px;
  padding: 10px 12px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  max-height: 360px;
  overflow-y: auto;
}

.progress-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.total-duration {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: #909399;
  background: #f5f7fa;
  border-radius: 10px;

  &::before {
    content: '⏱';
    font-size: 10px;
  }
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

// —— 步骤卡片 ——
.step-card {
  position: relative;
  padding: 0;
  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;

  &.is-expanded {
    border-color: #d9ecff;
    box-shadow: 0 1px 4px rgba(64, 158, 255, 0.06);
  }

  // 左侧状态色条（与 LangFlow Playground 节点卡片同款手法）
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: #e4e7ed;
  }

  &.status-success::before { background: #67c23a; }
  &.status-error::before,
  &.step-error::before     { background: #f56c6c; }
  &.status-running::before {
    background: #409eff;
    animation: stepPulse 1.4s ease-in-out infinite;
  }

  &.is-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    color: #909399;
    font-style: italic;
    font-size: 12px;

    &::before { background: transparent; }
  }
}

@keyframes stepPulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}

.step-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 14px;

  &.clickable {
    cursor: pointer;
    user-select: none;
    &:hover { background: #fafbff; }
  }
}

.step-icon {
  flex: 0 0 auto;
  font-size: 13px;
  line-height: 1;
}

.step-title {
  flex: 1 1 auto;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  word-break: break-word;
}

.step-card.status-running .step-title { color: #409eff; }
.step-card.status-error .step-title,
.step-card.step-error .step-title     { color: #f56c6c; }

.step-duration {
  flex: 0 0 auto;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: #909399;

  &.running-dot {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #409eff;
      animation: stepPulse 1.4s ease-in-out infinite;
    }
  }
}

.step-chevron {
  flex: 0 0 auto;
  width: 16px;
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
  user-select: none;
}

// —— 展开区 ——
.step-body {
  padding: 0 12px 10px 14px;
  border-top: 1px solid #f0f2f5;
}

.step-tabs {
  display: flex;
  gap: 4px;
  margin: 8px 0 6px;
}

.step-tab {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #909399;
  background: #f5f7fa;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s, color 0.15s;

  &.active {
    color: #409eff;
    background: #ecf5ff;
  }

  &:hover:not(.active) {
    color: #606266;
    background: #ebeef5;
  }
}

.step-section-label {
  margin: 8px 0 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #909399;
  text-transform: uppercase;
}

.step-content-box {
  background: #f7f9fc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.step-content-text {
  max-height: 260px;
  padding: 8px 10px;
  overflow: auto;
  font-size: 12.5px;
  line-height: 1.65;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
}

// —— 表格渲染（结构化 input/output 用） ——
.step-content-table-wrap {
  max-height: 320px;
  overflow: auto;
}

.step-content-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  background: #ffffff;

  thead tr {
    background: linear-gradient(180deg, #f5f7fa, #f0f2f5);
  }

  th {
    position: sticky;
    top: 0;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 11px;
    color: #606266;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid #e4e7ed;
    background: #f5f7fa;
    z-index: 1;
  }

  td {
    padding: 5px 10px;
    vertical-align: top;
    border-bottom: 1px solid #f0f2f5;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    max-width: 380px;
  }

  td:first-child {
    font-weight: 500;
    color: #303133;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 180px;
  }

  tbody tr:nth-child(even) {
    background: #fafbfc;
  }

  tbody tr:hover {
    background: #ecf5ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
}

// —— 图片单元格 ——
.step-cell-image {
  display: block;
  max-width: 160px;
  max-height: 120px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: zoom-in;
}

.step-cell-image-broken {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  font-size: 11px;
  color: #909399;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

// —— 链接单元格 ——
.step-cell-link {
  color: #409eff;
  text-decoration: none;
  word-break: break-all;
  overflow-wrap: anywhere;

  &:hover {
    color: #66b1ff;
    text-decoration: underline;
  }

  &:visited {
    color: #6a5acd;
  }
}

// —— 错误条 ——
.step-error {
  margin: 0 12px 10px 14px;
  padding: 6px 10px;
  font-size: 11px;
  line-height: 1.5;
  color: #f56c6c;
  background: #fef0f0;
  border-left: 2px solid #f56c6c;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

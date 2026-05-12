import { getToken } from '/@/utils/token'
import type { AiStreamStepEvent } from '/@/type/ai/chat'

interface StreamCallbacks {
  onChunk: (chunk: string) => void
  /**
   * 后端结构化"思考链"步骤事件（vertex / tool / error，含 summary 文案）。
   * 用于前端在最终结果出来前实时展示 AI 的执行过程。
   */
  onStep?: (step: AiStreamStepEvent) => void
  onDone: (payload?: any) => void
  onError: (message: string) => void
}

// 按 SSE 规范解析单个事件块：识别 event: / data: 字段，多行 data 用 \n 拼接后再交给上层 JSON.parse。
const parseSseBlock = (block: string): { event: string | null; data: string } => {
  let event: string | null = null
  const dataLines: string[] = []

  for (const rawLine of block.split('\n')) {
    const line = rawLine.replace(/\r$/, '')
    if (!line || line.startsWith(':')) continue

    const colonIdx = line.indexOf(':')
    const field = colonIdx === -1 ? line : line.slice(0, colonIdx)
    let value = colonIdx === -1 ? '' : line.slice(colonIdx + 1)
    if (value.startsWith(' ')) value = value.slice(1)

    if (field === 'event') event = value
    else if (field === 'data') dataLines.push(value)
  }

  return { event, data: dataLines.join('\n') }
}

export const streamAiMessage = async (
  data: {
    conversationId: number | string
    content?: string
    model?: string
    attachments?: string[]
  },
  callbacks: StreamCallbacks,
  signal?: AbortSignal
) => {
  const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/ai/conversations/${data.conversationId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(data),
    signal,
  })

  if (!response.ok || !response.body) {
    const message = `流式请求失败：${response.status}`
    callbacks.onError(message)
    throw new Error(message)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let settled = false

  // [TEMP DEBUG] 流式到达时序日志，定位完毕后删除
  const t0 = performance.now()
  let readCount = 0
  let chunkCount = 0
  console.log(`[sse] start  ${new Date().toISOString()}`)

  const fireDone = (payload?: any) => {
    if (settled) return
    settled = true
    callbacks.onDone(payload)
  }
  const fireError = (message: string) => {
    if (settled) return
    settled = true
    callbacks.onError(message)
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    readCount += 1
    console.log(`[sse] read#${readCount} +${(performance.now() - t0).toFixed(0)}ms bytes=${value?.byteLength ?? 0}`)

    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      const { event, data: dataStr } = parseSseBlock(block)
      if (!event && !dataStr) continue

      let payload: any = dataStr
      try {
        payload = JSON.parse(dataStr)
      } catch {}

      // 后端规范 SSE：event:chunk|done|error，data 为对应 JSON。
      if (event === 'chunk') {
        const text = typeof payload === 'string' ? payload : payload?.content ?? ''
        if (text) {
          chunkCount += 1
          console.log(`[sse] chunk#${chunkCount} +${(performance.now() - t0).toFixed(0)}ms len=${text.length} text=${JSON.stringify(text.slice(0, 30))}`)
          callbacks.onChunk(text)
          // 让出宏任务，避免同一 read 内多条事件被 Vue 合并成一次渲染（微任务 break 不足以触发 paint）。
          await new Promise((resolve) => setTimeout(resolve, 0))
        }
      } else if (event === 'step') {
        // 后端结构化思考链步骤，payload 是 AiStreamStepEvent
        if (callbacks.onStep && payload && typeof payload === 'object' && payload.stepType) {
          try {
            callbacks.onStep(payload as AiStreamStepEvent)
          } catch (err) {
            console.warn('[sse] onStep 回调异常', err)
          }
        }
      } else if (event === 'done') {
        console.log(`[sse] done   +${(performance.now() - t0).toFixed(0)}ms reads=${readCount} chunks=${chunkCount}`)
        fireDone(payload)
        return
      } else if (event === 'error') {
        const msg = (typeof payload === 'object' && payload?.message) || '流式响应异常'
        fireError(msg)
        throw new Error(msg)
      } else {
        // 兼容无 event 名的旧约定：按 payload.type / payload.content 兜底。
        if (typeof payload === 'string') {
          if (payload) {
            callbacks.onChunk(payload)
            await new Promise((resolve) => setTimeout(resolve, 0))
          }
        } else if (payload?.type === 'chunk') {
          callbacks.onChunk(payload.content ?? '')
          await new Promise((resolve) => setTimeout(resolve, 0))
        } else if (payload?.type === 'done') {
          fireDone(payload)
          return
        } else if (payload?.type === 'error') {
          const msg = payload.message ?? '流式响应异常'
          fireError(msg)
          throw new Error(msg)
        } else if (payload?.content) {
          callbacks.onChunk(payload.content)
          await new Promise((resolve) => setTimeout(resolve, 0))
        }
      }
    }
  }

  fireDone()
}

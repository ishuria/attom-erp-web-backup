import { getToken } from '/@/utils/token'

interface StreamCallbacks {
  onChunk: (chunk: string) => void
  onDone: (payload?: any) => void
  onError: (message: string) => void
}

export const streamAiMessage = async (
  data: {
    conversationId: number | string
    content: string
    model?: string
  },
  callbacks: StreamCallbacks
) => {
  const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/v1/ai/conversations/${data.conversationId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok || !response.body) {
    const message = `流式请求失败：${response.status}`
    callbacks.onError(message)
    throw new Error(message)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('data:'))

      for (const line of lines) {
        const raw = line.replace(/^data:\s*/, '')
        if (!raw) continue

        let payload: any = raw
        try {
          payload = JSON.parse(raw)
        } catch {}

        if (typeof payload === 'string') {
          callbacks.onChunk(payload)
          continue
        }

        if (payload.type === 'chunk') callbacks.onChunk(payload.content ?? '')
        else if (payload.type === 'done') callbacks.onDone(payload)
        else if (payload.type === 'error') {
          const message = payload.message ?? '流式响应异常'
          callbacks.onError(message)
          throw new Error(message)
        } else if (payload.content) callbacks.onChunk(payload.content)
      }
    }
  }

  callbacks.onDone()
}

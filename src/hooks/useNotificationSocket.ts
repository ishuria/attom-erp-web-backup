import { Client, type IMessage, type StompHeaders, type StompSubscription } from '@stomp/stompjs'

interface NotificationSocketOptions {
  token?: string
  onConnect?: () => void
  onDisconnect?: () => void
  onMessage?: (payload: any) => void
  onError?: (error: unknown) => void
}

const sanitizeDebugMessage = (message: string) => {
  return message.replace(/^(Authorization|accessToken|token):.*$/gim, '$1:[REDACTED]')
}

const normalizeWsProtocol = (url: URL) => {
  if (url.protocol === 'http:') {
    url.protocol = 'ws:'
    return
  }

  if (url.protocol === 'https:') url.protocol = 'wss:'
}

const resolveNotificationWsUrl = () => {
  const explicitWsUrl = import.meta.env.VITE_APP_WS_URL?.trim()
  if (explicitWsUrl) {
    const normalizedUrl = new URL(explicitWsUrl, window.location.origin)
    normalizeWsProtocol(normalizedUrl)
    normalizedUrl.search = ''
    normalizedUrl.hash = ''
    return normalizedUrl.toString()
  }

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin
  const normalizedUrl = new URL(baseUrl, window.location.origin)
  normalizeWsProtocol(normalizedUrl)
  normalizedUrl.pathname = '/ws'
  normalizedUrl.search = ''
  normalizedUrl.hash = ''
  return normalizedUrl.toString()
}

export const createNotificationSocket = (options: NotificationSocketOptions) => {
  const brokerURL = resolveNotificationWsUrl()
  let subscription: StompSubscription | undefined
  let disconnected = false

  const emitDisconnect = () => {
    if (disconnected) return
    disconnected = true
    options.onDisconnect?.()
  }

  const emitError = (message: string, detail?: unknown) => {
    const extra = detail instanceof Error ? detail.message : String(detail ?? '')
    const suffix = extra ? `, detail: ${extra}` : ''
    options.onError?.(new Error(`${message}, url: ${brokerURL}${suffix}`))
  }

  const resolveConnectHeaders = (): StompHeaders => {
    if (!options.token) return {}

    return {
      Authorization: `Bearer ${options.token}`,
      accessToken: options.token,
      token: options.token,
    }
  }

  const client = new Client({
    brokerURL,
    connectHeaders: resolveConnectHeaders(),
    reconnectDelay: 0,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    beforeConnect: () => {
      disconnected = false
      const connectHeaders = resolveConnectHeaders()
      client.connectHeaders = connectHeaders

      if (import.meta.env.DEV) {
        console.info('[notification-socket] preparing STOMP CONNECT', {
          hasAuthorization: Boolean(connectHeaders.Authorization),
          headerKeys: Object.keys(connectHeaders),
          tokenLength: options.token?.length ?? 0,
          url: brokerURL,
        })
      }

      if (!connectHeaders.Authorization) emitError('STOMP CONNECT 缺少 Authorization 头')
    },
    debug: (message) => {
      if (!import.meta.env.DEV) return
      console.info('[notification-stomp]', sanitizeDebugMessage(message))
    },
    onConnect: () => {
      subscription = client.subscribe('/user/queue/notifications', (message: IMessage) => {
        try {
          const payload = message.body ? JSON.parse(message.body) : {}
          options.onMessage?.(payload)
        } catch (error) {
          emitError('通知消息解析失败', error)
        }
      })
      options.onConnect?.()
    },
    onDisconnect: () => {
      emitDisconnect()
    },
    onStompError: (frame) => {
      emitError(frame.headers.message || 'STOMP 连接异常', frame.body)
    },
    onWebSocketClose: (event) => {
      if (event.code !== 1000) emitError(`WebSocket 连接关闭(code=${event.code}, clean=${event.wasClean})`, event.reason)
      emitDisconnect()
    },
    onWebSocketError: (event) => {
      emitError('WebSocket 连接异常', event)
    },
  })

  const activate = () => {
    if (!client.active) client.activate()
  }

  const deactivate = async () => {
    subscription?.unsubscribe()
    subscription = undefined
    if (client.active) await client.deactivate()
  }

  return {
    activate,
    client,
    deactivate,
    url: brokerURL,
  }
}

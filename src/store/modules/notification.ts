import dayjs from 'dayjs'
import { markRaw } from 'vue'
import { $baseMessage } from '/@/hooks'
import { getNotificationUnreadCount, markAllNotificationsRead } from '/@/api/devlocal/notification'
import { createNotificationSocket } from '/@/hooks/useNotificationSocket'
import { useUserStore } from '/@/store/modules/user'

const NOTIFICATION_SYNC_KEY = 'notification-sync'
const MAX_RECONNECT_ATTEMPTS = 5

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    connected: false,
    connecting: false,
    initialized: false,
    initializing: false,
    lastSyncTime: '',
    manualDisconnect: false,
    reconnectAttempts: 0,
    reconnectTimer: null as ReturnType<typeof setTimeout> | null,
    socketClient: null as ReturnType<typeof createNotificationSocket> | null,
    storageListenerBound: false,
    subscribed: false,
    unreadCount: 0,
  }),
  getters: {
    displayUnreadCount: (state) => {
      if (state.unreadCount <= 0) return ''
      if (state.unreadCount > 99) return '99+'
      return String(state.unreadCount)
    },
  },
  actions: {
    bindStorageSync() {
      if (this.storageListenerBound || typeof window === 'undefined') return

      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key !== NOTIFICATION_SYNC_KEY || !event.newValue) return

        try {
          const payload = JSON.parse(event.newValue)
          if (payload?.type === 'notification-read-all') {
            this.syncUnreadCount(0)
            return
          }
          if (payload?.type === 'notification-unread-sync' && Number.isFinite(payload?.count)) {
            this.syncUnreadCount(payload.count)
          }
        } catch {}
      })

      this.storageListenerBound = true
    },
    broadcast(payload: Record<string, any>) {
      if (typeof window === 'undefined') return
      localStorage.setItem(
        NOTIFICATION_SYNC_KEY,
        JSON.stringify({
          ...payload,
          timestamp: Date.now(),
        })
      )
    },
    syncUnreadCount(count: number) {
      this.unreadCount = Math.max(0, Number(count) || 0)
      this.lastSyncTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    async initUnreadCount() {
      try {
        const response: any = await getNotificationUnreadCount()
        const count = response?.data?.count ?? response?.count ?? 0
        this.syncUnreadCount(count)
      } catch {
        this.syncUnreadCount(this.unreadCount)
      }
    },
    clearReconnectTimer() {
      if (!this.reconnectTimer) return
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    },
    scheduleReconnect() {
      const userStore = useUserStore()
      if (!userStore.token) return
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return

      this.clearReconnectTimer()
      const delay = 2 ** this.reconnectAttempts * 1000
      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts += 1
        void this.connectSocket()
      }, delay)
    },
    handleNotificationMessage(payload: any) {
      if (!Number.isFinite(payload?.unreadCount)) {
        console.warn('Invalid notification payload:', payload)
        return
      }

      this.syncUnreadCount(payload.unreadCount)
      this.broadcast({
        count: this.unreadCount,
        type: 'notification-unread-sync',
      })
    },
    async connectSocket() {
      const userStore = useUserStore()
      if (!userStore.token) return
      if (this.connected || this.connecting) return
      if (this.socketClient?.client?.active) return

      this.connecting = true
      await this.disconnectSocket(true)
      this.manualDisconnect = false

      const socket = createNotificationSocket({
        token: String(userStore.token),
        onConnect: () => {
          this.connecting = false
          this.clearReconnectTimer()
          this.connected = true
          this.subscribed = true
          this.reconnectAttempts = 0
          this.lastSyncTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        },
        onDisconnect: () => {
          this.connecting = false
          this.connected = false
          this.subscribed = false
          this.socketClient = null
          if (!this.manualDisconnect) this.scheduleReconnect()
        },
        onError: (error) => {
          this.connecting = false
          console.warn('Notification socket error:', error)
        },
        onMessage: (payload) => {
          this.handleNotificationMessage(payload)
        },
      })

      this.socketClient = markRaw(socket)
      socket.activate()
    },
    async disconnectSocket(keepManualDisconnect = true) {
      this.manualDisconnect = keepManualDisconnect
      this.clearReconnectTimer()
      const socketClient = this.socketClient
      this.socketClient = null
      this.connecting = false
      this.connected = false
      this.subscribed = false
      if (socketClient) await socketClient.deactivate()
    },
    async markAllRead(showSuccessMessage = false) {
      if (this.unreadCount <= 0) return

      try {
        await markAllNotificationsRead()
        this.syncUnreadCount(0)
        this.broadcast({
          type: 'notification-read-all',
        })
        if (showSuccessMessage) $baseMessage('已全部标记为已读', 'success')
      } catch (error: any) {
        $baseMessage(error?.msg ?? error?.message ?? '已读失败，请稍后重试', 'error')
      }
    },
    async initialize() {
      const userStore = useUserStore()
      if (!userStore.token) return
      if (this.initializing) return

      this.initializing = true
      this.bindStorageSync()
      try {
        await this.initUnreadCount()
        if (!this.connected) await this.connectSocket()
        this.initialized = true
      } finally {
        this.initializing = false
      }
    },
    async resetState() {
      await this.disconnectSocket(true)
      this.initialized = false
      this.connecting = false
      this.initializing = false
      this.manualDisconnect = false
      this.reconnectAttempts = 0
      this.lastSyncTime = ''
      this.unreadCount = 0
    },
  },
})

import request from '/@/utils/request'
import { BASE_API } from '/@/api/devlocal/api'

const NOTIFICATION_BASE_API = `${BASE_API}/notifications`

export const getNotificationUnreadCount = () => {
  return request({
    url: `${NOTIFICATION_BASE_API}/unread-count`,
    method: 'get',
  })
}

export const markAllNotificationsRead = () => {
  return request({
    url: `${NOTIFICATION_BASE_API}/mark-read`,
    method: 'post',
  })
}

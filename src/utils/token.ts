import { storage as _storage, tokenTableName } from '/@/config'

const storage = _storage || 'localStorage'

const userIdTableName = `${tokenTableName}-userId`

/**
 * @description 获取token
 */
export const getToken = () => {
  if ('localStorage' === storage) return localStorage.getItem(tokenTableName)
  else if ('sessionStorage' === storage) return sessionStorage.getItem(tokenTableName)
}

/**
 * @description 存储token
 * @param token
 */
export const setToken = (token: string) => {
  if ('localStorage' === storage) return localStorage.setItem(tokenTableName, token)
  else if ('sessionStorage' === storage) return sessionStorage.setItem(tokenTableName, token)
}

/**
 * @description 移除token
 */
export const removeToken = (storage = 'localStorage') => {
  if ('localStorage' === storage) return localStorage.removeItem(tokenTableName)
  else if ('sessionStorage' === storage) return sessionStorage.clear()
}

/**
 * @description 获取持久化的 userId
 */
export const getStoredUserId = () => {
  if ('localStorage' === storage) return localStorage.getItem(userIdTableName)
  else if ('sessionStorage' === storage) return sessionStorage.getItem(userIdTableName)
}

/**
 * @description 持久化 userId
 */
export const setStoredUserId = (userId: string) => {
  if ('localStorage' === storage) return localStorage.setItem(userIdTableName, userId)
  else if ('sessionStorage' === storage) return sessionStorage.setItem(userIdTableName, userId)
}

/**
 * @description 移除持久化的 userId
 */
export const removeStoredUserId = () => {
  if ('localStorage' === storage) return localStorage.removeItem(userIdTableName)
  else if ('sessionStorage' === storage) return sessionStorage.removeItem(userIdTableName)
}

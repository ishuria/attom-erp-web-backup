import request from '/@/utils/request'
import { loginRSA } from '/@/config'
import { encryptedData } from '/@/utils/encrypt'

export async function login(data: object) {
  if (loginRSA) {
    data = { ...data, password: await encryptedData(data) }
  }
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  })
}

export function register(data: any) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}

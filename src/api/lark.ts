import axios from 'axios'

// 走 vite 代理（vite.config.ts 中 ^/lark-api → http://192.168.6.14:9231/api/v1）
// 避免浏览器直连跨域。生产环境需在网关/Nginx 层做同样转发，或后端补 CORS 头。
const larkRequest = axios.create({
  baseURL: '/lark-api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const exchangeLarkToken = (data: { authorization_code: string; user_id: string | number }) => {
  return larkRequest.post('/lark/token/exchange', data)
}

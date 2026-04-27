import axios from 'axios'

const larkRequest = axios.create({
  baseURL: 'http://192.168.6.14:9231/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const exchangeLarkToken = (data: { authorization_code: string; user_id: string | number }) => {
  return larkRequest.post('/lark/token/exchange', data)
}

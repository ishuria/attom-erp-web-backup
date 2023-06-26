import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/uploadFlie',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟上传成功',
      }
    },
  },
] as MockMethod[]

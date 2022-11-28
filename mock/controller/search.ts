import { VabMockMethod } from '../utils'

const List = [
  {
    url: 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&ch=2&tn=98010089_dg&wd=vue%20&oq=vue-admin-beautiful.com&rsv_pq=b215c78a0002ad2a&rsv_t=fd68WIm0DZNacNk7nP82ick5oy27LIk7TfoEMZ5mau6Z2ecnUcskFCtd3%2BNcAgjSRwU&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_sug3=13&rsv_sug1=4&rsv_sug7=100&si=vue-admin-beautiful.com&ct=2097152',
    value: 'vue-admin-better官网',
  },
]

export default [
  {
    url: '/search/getList',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: { list: List },
      }
    },
  },
] as VabMockMethod[]

import { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'

/**
 * @description 随机生成图片url。
 * @returns {string}
 */
function handleRandomImage() {
  return (
    'https://fastly.jsdelivr.net/gh/' +
    'chuzh' +
    'ixin/image' +
    `/table/vab-image-${Random.integer(1, 38)}.jpg`
  )
}

const List: any = []
const count = 50
for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: '@uuid',
      id: '@id',
      title: '@title(1, 2)',
      description: '@csentence',
      'status|1': ['published', 'draft', 'deleted'],
      author: '@cname',
      datetime: '@datetime',
      pageViews: '@integer(300, 5000)',
      img: handleRandomImage(),
      switch: '@boolean',
      percent: '@integer(80,99)',
      'rate|1': [1, 2, 3, 4, 5],
      'type|1': [0, 1],
      percentage: '@integer(0,100)',
    })
  )
}

export default [
  {
    url: '/table/getList',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: { list: List },
      }
    },
  },
] as MockMethod[]

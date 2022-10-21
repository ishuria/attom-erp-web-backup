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

module.exports = [
  {
    url: '/goodsManagement/getList',
    method: 'get',
    response(config: {
      query: { title: any; pageNo?: 1 | undefined; pageSize?: 20 | undefined }
    }) {
      const { title, pageNo = 1, pageSize = 20 } = config.query
      const mockList = List.filter(
        (item: { title: string | any[] }) =>
          !(title && item.title.indexOf(title) < 0)
      )
      const list = mockList.filter(
        (item: any, index: number) =>
          index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )
      return {
        code: 200,
        msg: 'success',
        data: { list, ...{ total: mockList.length } },
      }
    },
  },
  {
    url: '/goodsManagement/doEdit',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/goodsManagement/doDelete',
    method: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
] as MockMethod[]

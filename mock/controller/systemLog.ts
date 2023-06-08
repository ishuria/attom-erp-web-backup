import { MockMethod } from 'vite-plugin-mock'

const { mock } = require('mockjs')
const List: any = []
const count = 50
for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: '@uuid',
      id: '@id',
      account: '@account(1, 2)',
      'type|1': ['操作日志', '数据库日志', '系统日志'],
      'account|1': ['admin', 'editor', 'test'],
      'executeResult|1': [
        '登录成功',
        '登录成功',
        '登录失败',
        '接口异常',
        'dos攻击',
      ],
      ip: '@ip',
      datetime: '@datetime',
    })
  )
}

export default [
  {
    url: '/systemLog/getList',
    method: 'get',
    response: (config: any) => {
      const { account, pageNo = 1, pageSize = 20 } = config.query
      const mockList = List.filter(
        (item: any) => !(account && item.account.indexOf(account) < 0)
      )
      const list = mockList.filter(
        (item: any, index: any) =>
          index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )
      return {
        code: 200,
        msg: 'success',
        data: { list, ...{ total: mockList.length } },
      }
    },
  },
] as MockMethod[]

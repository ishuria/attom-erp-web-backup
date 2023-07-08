import { MockMethod } from 'vite-plugin-mock'

const List = [
  {
    value: 'root',
    createTime: '@datetime',
    label: '根节点',
    order: 0,
    children: [
      {
        value: '1',
        parentValue: 'root',
        parentLabel: '根节点',
        createTime: '@datetime',
        label: '桃花坞',
        order: 0,
      },
      {
        value: '2',
        parentValue: 'root',
        parentLabel: '根节点',
        createTime: '@datetime',
        label: '少林寺',
        order: 1,
        children: [
          {
            value: '@uuid',
            parentValue: '2',
            parentLabel: '少林寺',
            createTime: '@datetime',
            label: '达摩院',
            order: 0,
          },
          {
            value: '@uuid',
            parentValue: '2',
            parentLabel: '少林寺',
            createTime: '@datetime',
            label: '戒律堂',
            order: 1,
          },
        ],
      },
    ],
  },
]

export default [
  {
    url: '/departmentManagement/getList',
    method: 'get',
    response: ({ query }: any) => {
      const { label, pageNo = 1, pageSize = 20 } = query
      const mockList = List.filter(
        (item) => !(label && item.label.indexOf(label) < 0)
      )
      const list = mockList.filter(
        (item, index) =>
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
    url: '/departmentManagement/doEdit',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/departmentManagement/doDelete',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
] as MockMethod[]

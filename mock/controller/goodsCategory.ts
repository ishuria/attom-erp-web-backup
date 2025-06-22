import type { MockMethod } from 'vite-plugin-mock'

const List = [
    {
        id: '@id',
        name: '电子产品',
        code: 'ELECTRONIC',
        sort: 1,
        status: '启用',
        description: '各类电子产品分类',
        createTime: '@datetime',
        children: [
            {
                id: '@id',
                name: '手机数码',
                code: 'PHONE',
                sort: 1,
                status: '启用',
                description: '手机、平板等数码产品',
                createTime: '@datetime',
            },
            {
                id: '@id',
                name: '电脑办公',
                code: 'COMPUTER',
                sort: 2,
                status: '启用',
                description: '笔记本电脑、台式机等',
                createTime: '@datetime',
            },
            {
                id: '@id',
                name: '家用电器',
                code: 'APPLIANCE',
                sort: 3,
                status: '启用',
                description: '冰箱、洗衣机等家电',
                createTime: '@datetime',
            },
        ],
    },
    {
        id: '@id',
        name: '服装鞋帽',
        code: 'CLOTHING',
        sort: 2,
        status: '启用',
        description: '各类服装鞋帽分类',
        createTime: '@datetime',
        children: [
            {
                id: '@id',
                name: '男装',
                code: 'MEN',
                sort: 1,
                status: '启用',
                description: '男士服装',
                createTime: '@datetime',
            },
            {
                id: '@id',
                name: '女装',
                code: 'WOMEN',
                sort: 2,
                status: '启用',
                description: '女士服装',
                createTime: '@datetime',
            },
            {
                id: '@id',
                name: '童装',
                code: 'CHILDREN',
                sort: 3,
                status: '启用',
                description: '儿童服装',
                createTime: '@datetime',
            },
        ],
    },
    {
        id: '@id',
        name: '食品饮料',
        code: 'FOOD',
        sort: 3,
        status: '启用',
        description: '各类食品饮料分类',
        createTime: '@datetime',
        children: [
            {
                id: '@id',
                name: '零食小吃',
                code: 'SNACK',
                sort: 1,
                status: '启用',
                description: '各类零食小吃',
                createTime: '@datetime',
            },
            {
                id: '@id',
                name: '饮料冲调',
                code: 'DRINK',
                sort: 2,
                status: '启用',
                description: '各类饮料和冲调饮品',
                createTime: '@datetime',
            },
        ],
    },
]

export default [
    {
        url: '/goodsCategory/getTree',
        method: 'get',
        response() {
            return {
                code: 200,
                msg: 'success',
                data: List,
            }
        },
    },
    {
        url: '/goodsCategory/getList',
        method: 'get',
        response({ query }: any) {
            const { name, pageNo = 1, pageSize = 20 } = query
            const mockList = List.filter((item: { name: string | any[] }) => !(name && !item.name.includes(name)))
            const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
            return {
                code: 200,
                msg: 'success',
                data: { list, total: mockList.length },
            }
        },
    },
    {
        url: '/goodsCategory/doEdit',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟保存成功',
            }
        },
    },
    {
        url: '/goodsCategory/doDelete',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟删除成功',
            }
        },
    },
] as MockMethod[]

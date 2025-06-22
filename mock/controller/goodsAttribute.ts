import type { MockMethod } from 'vite-plugin-mock'

interface AttributeItem {
    id: string
    name: string
    code: string
    type: string
    required: string
    sort: string
    status: string
    createTime: string
    values: AttributeValueItem[]
}

interface AttributeValueItem {
    id: string
    value: string
    sort: string
    status: string
}

const AttributeList: AttributeItem[] = [
    {
        id: '@id',
        name: '颜色',
        code: 'COLOR',
        type: '选择',
        required: '是',
        sort: '1',
        status: '启用',
        createTime: '@datetime',
        values: [
            { id: '@id', value: '红色', sort: '1', status: '启用' },
            { id: '@id', value: '蓝色', sort: '2', status: '启用' },
            { id: '@id', value: '绿色', sort: '3', status: '启用' },
            { id: '@id', value: '黄色', sort: '4', status: '启用' },
            { id: '@id', value: '黑色', sort: '5', status: '启用' },
            { id: '@id', value: '白色', sort: '6', status: '启用' },
        ],
    },
    {
        id: '@id',
        name: '尺寸',
        code: 'SIZE',
        type: '选择',
        required: '是',
        sort: '2',
        status: '启用',
        createTime: '@datetime',
        values: [
            { id: '@id', value: 'XS', sort: '1', status: '启用' },
            { id: '@id', value: 'S', sort: '2', status: '启用' },
            { id: '@id', value: 'M', sort: '3', status: '启用' },
            { id: '@id', value: 'L', sort: '4', status: '启用' },
            { id: '@id', value: 'XL', sort: '5', status: '启用' },
            { id: '@id', value: 'XXL', sort: '6', status: '启用' },
        ],
    },
    {
        id: '@id',
        name: '品牌',
        code: 'BRAND',
        type: '选择',
        required: '是',
        sort: '3',
        status: '启用',
        createTime: '@datetime',
        values: [
            { id: '@id', value: '苹果', sort: '1', status: '启用' },
            { id: '@id', value: '华为', sort: '2', status: '启用' },
            { id: '@id', value: '小米', sort: '3', status: '启用' },
            { id: '@id', value: '三星', sort: '4', status: '启用' },
            { id: '@id', value: 'OPPO', sort: '5', status: '启用' },
            { id: '@id', value: 'vivo', sort: '6', status: '启用' },
        ],
    },
    {
        id: '@id',
        name: '材质',
        code: 'MATERIAL',
        type: '选择',
        required: '否',
        sort: '4',
        status: '启用',
        createTime: '@datetime',
        values: [
            { id: '@id', value: '塑料', sort: '1', status: '启用' },
            { id: '@id', value: '金属', sort: '2', status: '启用' },
            { id: '@id', value: '玻璃', sort: '3', status: '启用' },
            { id: '@id', value: '陶瓷', sort: '4', status: '启用' },
            { id: '@id', value: '木材', sort: '5', status: '启用' },
        ],
    },
    {
        id: '@id',
        name: '重量',
        code: 'WEIGHT',
        type: '输入',
        required: '否',
        sort: '5',
        status: '启用',
        createTime: '@datetime',
        values: [],
    },
    {
        id: '@id',
        name: '产地',
        code: 'ORIGIN',
        type: '输入',
        required: '否',
        sort: '6',
        status: '启用',
        createTime: '@datetime',
        values: [],
    },
]

export default [
    {
        url: '/goodsAttribute/getList',
        method: 'get',
        response({ query }: any) {
            const { name, type, status, pageNo = 1, pageSize = 20 } = query
            let mockList = AttributeList
            if (name) {
                mockList = mockList.filter((item: AttributeItem) => item.name.includes(name))
            }
            if (type) {
                mockList = mockList.filter((item: AttributeItem) => item.type === type)
            }
            if (status) {
                mockList = mockList.filter((item: AttributeItem) => item.status === status)
            }
            const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
            return {
                code: 200,
                msg: 'success',
                data: { list, total: mockList.length },
            }
        },
    },
    {
        url: '/goodsAttribute/getDetail',
        method: 'get',
        response({ query }: any) {
            const { id } = query
            const item = AttributeList.find((item: AttributeItem) => item.id === id)
            return {
                code: 200,
                msg: 'success',
                data: item,
            }
        },
    },
    {
        url: '/goodsAttribute/doEdit',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟保存成功',
            }
        },
    },
    {
        url: '/goodsAttribute/doDelete',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟删除成功',
            }
        },
    },
    {
        url: '/goodsAttribute/doEditValue',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '属性值保存成功',
            }
        },
    },
    {
        url: '/goodsAttribute/doDeleteValue',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '属性值删除成功',
            }
        },
    },
] as MockMethod[]

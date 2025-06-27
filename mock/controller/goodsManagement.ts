import type { MockMethod } from 'vite-plugin-mock'
import { handleRandomImage } from '../utils/index.ts'

const List = <any>[]
const count = 50
for (let i = 0; i < count; i++) {
    List.push({
        uuid: '@uuid',
        id: '@id',
        title: '@ctitle(5, 10)',
        description: '@ctitle(10, 20)',
        name: '@ctitle(3, 6)',
        'type|1': ['食品饮料', '家用电器', '其他'],
        price: '￥' + '@integer(0,100)',
        sales: '@integer(0,100)',
        stock: '@integer(0,100)',
        'status|1': ['已上架', '已下架', '待上架'],
        datetime: '@datetime',
        image: handleRandomImage(),
        link: 'https://www.baidu.com',
        'isRecommend|1': [1, 0],
    })
}

// SKU数据
const SkuList = [
    {
        id: '1',
        skuCode: 'SKU001',
        skuName: 'iPhone 15 Pro',
        specifications: [
            { key: '颜色', value: '银色' },
            { key: '存储容量', value: '128GB' },
        ],
        price: 7999,
        stock: 100,
        status: 'active',
        sort: 1,
        remark: '苹果旗舰手机',
        image: handleRandomImage(),
    },
    {
        id: '2',
        skuCode: 'SKU002',
        skuName: 'iPad Air',
        specifications: [
            { key: '颜色', value: '蓝色' },
            { key: '存储容量', value: '256GB' },
            { key: '连接', value: 'WiFi' },
        ],
        price: 4699,
        stock: 50,
        status: 'active',
        sort: 2,
        remark: '轻薄平板电脑',
        image: handleRandomImage(),
    },
]

export default [
    {
        url: '/goodsManagement/getList',
        method: 'get',
        response({ query }: any) {
            const { name, pageNo = 1, pageSize = 20 } = query
            const mockList = List.filter((item: { name: string | any[] }) => !(name && !item.name.includes(name)))
            const list = mockList.filter((item: any, index: number) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
            list.sort(() => Math.random() - 0.5)
            return {
                code: 200,
                msg: 'success',
                data: { list, total: mockList.length },
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
    // SKU相关接口
    {
        url: '/goodsSku/getList',
        method: 'get',
        response({ query }: any) {
            const { skuName, status, pageNo = 1, pageSize = 20 } = query
            let mockList = [...SkuList]

            // 按SKU名称筛选
            if (skuName) {
                mockList = mockList.filter((item: any) => item.skuName.includes(skuName))
            }

            // 按状态筛选
            if (status) {
                mockList = mockList.filter((item: any) => item.status === status)
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
        url: '/goodsSku/doAdd',
        method: 'post',
        response({ body }: any) {
            console.log('添加SKU数据:', body)

            // 处理批量SKU创建
            if (body.bulkOperation && body.skuList) {
                console.log(`批量创建了 ${body.skuList.length} 个SKU组合`)
                return {
                    code: 200,
                    msg: `成功创建 ${body.skuList.length} 个SKU组合`,
                }
            }

            return {
                code: 200,
                msg: 'SKU添加成功',
            }
        },
    },
    {
        url: '/goodsSku/doEdit',
        method: 'post',
        response({ body }: any) {
            console.log('更新SKU数据:', body)

            // 处理批量SKU更新
            if (body.bulkOperation && body.skuList) {
                console.log(`批量更新了 ${body.skuList.length} 个SKU组合`)
                return {
                    code: 200,
                    msg: `成功更新 ${body.skuList.length} 个SKU组合`,
                }
            }

            return {
                code: 200,
                msg: 'SKU更新成功',
            }
        },
    },
    {
        url: '/goodsSku/doDelete',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: 'SKU删除成功',
            }
        },
    },
] as MockMethod[]

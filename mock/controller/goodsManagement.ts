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
const SkuList = <any>[
    {
        id: '1',
        skuCode: 'SKU001',
        skuName: 'iPhone 14 Pro 128GB 深空黑',
        specifications: [
            { key: '颜色', value: '深空黑' },
            { key: '容量', value: '128GB' },
        ],
        price: 7999,
        stock: 100,
        status: 'active',
        sort: 1,
        remark: '热销商品',
    },
    {
        id: '2',
        skuCode: 'SKU002',
        skuName: 'iPhone 14 Pro 256GB 银色',
        specifications: [
            { key: '颜色', value: '银色' },
            { key: '容量', value: '256GB' },
        ],
        price: 8999,
        stock: 50,
        status: 'active',
        sort: 2,
        remark: '限量版',
    },
    {
        id: '3',
        skuCode: 'SKU003',
        skuName: 'MacBook Pro 14寸 M2芯片',
        specifications: [
            { key: '尺寸', value: '14寸' },
            { key: '芯片', value: 'M2' },
            { key: '内存', value: '16GB' },
        ],
        price: 14999,
        stock: 30,
        status: 'active',
        sort: 3,
        remark: '专业级笔记本',
    },
    {
        id: '4',
        skuCode: 'SKU004',
        skuName: 'MacBook Pro 16寸 M2 Max',
        specifications: [
            { key: '尺寸', value: '16寸' },
            { key: '芯片', value: 'M2 Max' },
            { key: '内存', value: '32GB' },
        ],
        price: 24999,
        stock: 15,
        status: 'active',
        sort: 4,
        remark: '顶级配置',
    },
    {
        id: '5',
        skuCode: 'SKU005',
        skuName: 'iPad Pro 12.9寸 128GB WiFi版',
        specifications: [
            { key: '尺寸', value: '12.9寸' },
            { key: '容量', value: '128GB' },
            { key: '网络', value: 'WiFi' },
        ],
        price: 6799,
        stock: 80,
        status: 'active',
        sort: 5,
        remark: '创意工作首选',
    },
    {
        id: '6',
        skuCode: 'SKU006',
        skuName: 'iPad Pro 11寸 256GB 蜂窝版',
        specifications: [
            { key: '尺寸', value: '11寸' },
            { key: '容量', value: '256GB' },
            { key: '网络', value: '蜂窝' },
        ],
        price: 7299,
        stock: 45,
        status: 'active',
        sort: 6,
        remark: '便携办公',
    },
    {
        id: '7',
        skuCode: 'SKU007',
        skuName: 'AirPods Pro 第二代',
        specifications: [
            { key: '型号', value: '第二代' },
            { key: '颜色', value: '白色' },
        ],
        price: 1899,
        stock: 200,
        status: 'active',
        sort: 7,
        remark: '主动降噪',
    },
    {
        id: '8',
        skuCode: 'SKU008',
        skuName: 'Apple Watch Series 8 45mm GPS版',
        specifications: [
            { key: '尺寸', value: '45mm' },
            { key: '网络', value: 'GPS' },
            { key: '颜色', value: '午夜色' },
        ],
        price: 2999,
        stock: 120,
        status: 'active',
        sort: 8,
        remark: '健康监测',
    },
    {
        id: '9',
        skuCode: 'SKU009',
        skuName: 'Apple Watch Ultra 49mm',
        specifications: [
            { key: '尺寸', value: '49mm' },
            { key: '网络', value: 'GPS+蜂窝' },
            { key: '颜色', value: '钛金属' },
        ],
        price: 6299,
        stock: 25,
        status: 'active',
        sort: 9,
        remark: '极限运动',
    },
    {
        id: '10',
        skuCode: 'SKU010',
        skuName: 'iMac 24寸 M1芯片 8核GPU',
        specifications: [
            { key: '尺寸', value: '24寸' },
            { key: '芯片', value: 'M1' },
            { key: 'GPU', value: '8核' },
            { key: '颜色', value: '蓝色' },
        ],
        price: 9999,
        stock: 35,
        status: 'active',
        sort: 10,
        remark: '一体机',
    },
    {
        id: '11',
        skuCode: 'SKU011',
        skuName: 'Mac mini M2芯片 8GB+256GB',
        specifications: [
            { key: '芯片', value: 'M2' },
            { key: '内存', value: '8GB' },
            { key: '存储', value: '256GB' },
        ],
        price: 4499,
        stock: 60,
        status: 'active',
        sort: 11,
        remark: '小巧强大',
    },
    {
        id: '12',
        skuCode: 'SKU012',
        skuName: 'Mac Studio M2 Max 32GB+512GB',
        specifications: [
            { key: '芯片', value: 'M2 Max' },
            { key: '内存', value: '32GB' },
            { key: '存储', value: '512GB' },
        ],
        price: 16499,
        stock: 20,
        status: 'active',
        sort: 12,
        remark: '专业工作站',
    },
    {
        id: '13',
        skuCode: 'SKU013',
        skuName: 'iPhone 14 128GB 蓝色',
        specifications: [
            { key: '颜色', value: '蓝色' },
            { key: '容量', value: '128GB' },
        ],
        price: 5999,
        stock: 150,
        status: 'active',
        sort: 13,
        remark: '入门款',
    },
    {
        id: '14',
        skuCode: 'SKU014',
        skuName: 'iPhone 14 Plus 256GB 紫色',
        specifications: [
            { key: '颜色', value: '紫色' },
            { key: '容量', value: '256GB' },
        ],
        price: 6999,
        stock: 90,
        status: 'active',
        sort: 14,
        remark: '大屏体验',
    },
    {
        id: '15',
        skuCode: 'SKU015',
        skuName: 'iPad Air 10.9寸 64GB WiFi版',
        specifications: [
            { key: '尺寸', value: '10.9寸' },
            { key: '容量', value: '64GB' },
            { key: '网络', value: 'WiFi' },
        ],
        price: 4399,
        stock: 110,
        status: 'active',
        sort: 15,
        remark: '轻薄便携',
    },
    {
        id: '16',
        skuCode: 'SKU016',
        skuName: 'iPad mini 8.3寸 256GB 蜂窝版',
        specifications: [
            { key: '尺寸', value: '8.3寸' },
            { key: '容量', value: '256GB' },
            { key: '网络', value: '蜂窝' },
        ],
        price: 4999,
        stock: 75,
        status: 'active',
        sort: 16,
        remark: '随身携带',
    },
    {
        id: '17',
        skuCode: 'SKU017',
        skuName: 'AirPods Max 银色',
        specifications: [
            { key: '颜色', value: '银色' },
            { key: '类型', value: '头戴式' },
        ],
        price: 4299,
        stock: 40,
        status: 'active',
        sort: 17,
        remark: '高端音频',
    },
    {
        id: '18',
        skuCode: 'SKU018',
        skuName: 'HomePod mini 白色',
        specifications: [
            { key: '颜色', value: '白色' },
            { key: '类型', value: '智能音箱' },
        ],
        price: 749,
        stock: 180,
        status: 'active',
        sort: 18,
        remark: '智能家居',
    },
    {
        id: '19',
        skuCode: 'SKU019',
        skuName: 'Apple TV 4K 128GB',
        specifications: [
            { key: '容量', value: '128GB' },
            { key: '分辨率', value: '4K' },
        ],
        price: 1399,
        stock: 65,
        status: 'active',
        sort: 19,
        remark: '家庭影院',
    },
    {
        id: '20',
        skuCode: 'SKU020',
        skuName: 'Magic Keyboard 带数字键盘',
        specifications: [
            { key: '类型', value: '带数字键盘' },
            { key: '连接', value: '蓝牙' },
        ],
        price: 1099,
        stock: 95,
        status: 'active',
        sort: 20,
        remark: '专业输入',
    },
    {
        id: '21',
        skuCode: 'SKU021',
        skuName: 'Magic Mouse 2 银色',
        specifications: [
            { key: '颜色', value: '银色' },
            { key: '连接', value: '蓝牙' },
        ],
        price: 549,
        stock: 130,
        status: 'inactive',
        sort: 21,
        remark: '无线鼠标',
    },
    {
        id: '22',
        skuCode: 'SKU022',
        skuName: 'Studio Display 27寸 标准玻璃',
        specifications: [
            { key: '尺寸', value: '27寸' },
            { key: '玻璃', value: '标准玻璃' },
            { key: '支架', value: '可调节' },
        ],
        price: 11499,
        stock: 15,
        status: 'active',
        sort: 22,
        remark: '专业显示器',
    },
    {
        id: '23',
        skuCode: 'SKU023',
        skuName: 'Pro Display XDR 32寸',
        specifications: [
            { key: '尺寸', value: '32寸' },
            { key: '分辨率', value: '6K' },
            { key: '亮度', value: '1000尼特' },
        ],
        price: 39999,
        stock: 8,
        status: 'active',
        sort: 23,
        remark: '顶级显示器',
    },
    {
        id: '24',
        skuCode: 'SKU024',
        skuName: 'iPhone 14 Pro Max 512GB 金色',
        specifications: [
            { key: '颜色', value: '金色' },
            { key: '容量', value: '512GB' },
        ],
        price: 10999,
        stock: 30,
        status: 'active',
        sort: 24,
        remark: '旗舰配置',
    },
    {
        id: '25',
        skuCode: 'SKU025',
        skuName: 'MacBook Air 13寸 M2芯片 8GB+256GB',
        specifications: [
            { key: '尺寸', value: '13寸' },
            { key: '芯片', value: 'M2' },
            { key: '内存', value: '8GB' },
            { key: '存储', value: '256GB' },
        ],
        price: 9499,
        stock: 70,
        status: 'active',
        sort: 25,
        remark: '轻薄本',
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
        response() {
            return {
                code: 200,
                msg: 'SKU添加成功',
            }
        },
    },
    {
        url: '/goodsSku/doEdit',
        method: 'post',
        response() {
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

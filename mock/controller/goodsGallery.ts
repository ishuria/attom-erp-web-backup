import type { MockMethod } from 'vite-plugin-mock'
import { handleRandomImage } from '../utils/index.ts'

interface GalleryItem {
    id: string
    name: string
    url: string
    category: string
    size: string
    width: string
    height: string
    uploadTime: string
    uploader: string
    status: string
}

interface CategoryItem {
    id: string
    name: string
    count: string
    createTime: string
}

const GalleryList: GalleryItem[] = []
const count = 100
for (let i = 0; i < count; i++) {
    GalleryList.push({
        id: '@id',
        name: '@ctitle(5, 15)',
        url: handleRandomImage(),
        category: '@pick(["商品主图", "详情图", "轮播图", "广告图", "其他"])',
        size: '@pick(["1.2MB", "2.5MB", "3.8MB", "5.2MB", "8.1MB"])',
        width: '@pick(["800", "1200", "1920", "2560"])',
        height: '@pick(["600", "800", "1080", "1440"])',
        uploadTime: '@datetime',
        uploader: '@cname',
        status: '@pick(["正常", "已删除"])',
    })
}

const CategoryList: CategoryItem[] = [
    {
        id: '@id',
        name: '商品主图',
        count: '45',
        createTime: '@datetime',
    },
    {
        id: '@id',
        name: '详情图',
        count: '32',
        createTime: '@datetime',
    },
    {
        id: '@id',
        name: '轮播图',
        count: '18',
        createTime: '@datetime',
    },
    {
        id: '@id',
        name: '广告图',
        count: '25',
        createTime: '@datetime',
    },
    {
        id: '@id',
        name: '其他',
        count: '15',
        createTime: '@datetime',
    },
]

export default [
    {
        url: '/goodsGallery/getList',
        method: 'get',
        response({ query }: any) {
            const { name, category, pageNo = 1, pageSize = 20 } = query
            let mockList = GalleryList
            if (name) {
                mockList = mockList.filter((item: GalleryItem) => item.name.includes(name))
            }
            if (category) {
                mockList = mockList.filter((item: GalleryItem) => item.category === category)
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
        url: '/goodsGallery/getCategoryList',
        method: 'get',
        response() {
            return {
                code: 200,
                msg: 'success',
                data: CategoryList,
            }
        },
    },
    {
        url: '/goodsGallery/doEdit',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟保存成功',
            }
        },
    },
    {
        url: '/goodsGallery/doDelete',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '模拟删除成功',
            }
        },
    },
    {
        url: '/goodsGallery/doUpload',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '上传成功',
            }
        },
    },
    {
        url: '/goodsGallery/doBatchDelete',
        method: 'post',
        response() {
            return {
                code: 200,
                msg: '批量删除成功',
            }
        },
    },
] as MockMethod[]

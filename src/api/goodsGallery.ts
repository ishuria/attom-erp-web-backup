import request from '/@/utils/request'

export function getGoodsGalleryList(params?: any) {
    return request({
        url: '/goodsGallery/getList',
        method: 'get',
        params,
    })
}

export function getGoodsGalleryCategoryList(params?: any) {
    return request({
        url: '/goodsGallery/getCategoryList',
        method: 'get',
        params,
    })
}

export function doGoodsGalleryEdit(data: any) {
    return request({
        url: '/goodsGallery/doEdit',
        method: 'post',
        data,
    })
}

export function doGoodsGalleryDelete(data: any) {
    return request({
        url: '/goodsGallery/doDelete',
        method: 'post',
        data,
    })
}

export function doGoodsGalleryUpload(data: any) {
    return request({
        url: '/goodsGallery/doUpload',
        method: 'post',
        data,
    })
}

export function doGoodsGalleryBatchDelete(data: any) {
    return request({
        url: '/goodsGallery/doBatchDelete',
        method: 'post',
        data,
    })
}

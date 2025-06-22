import request from '/@/utils/request'

export function getGoodsCategoryTree(params?: any) {
    return request({
        url: '/goodsCategory/getTree',
        method: 'get',
        params,
    })
}

export function getGoodsCategoryList(params?: any) {
    return request({
        url: '/goodsCategory/getList',
        method: 'get',
        params,
    })
}

export function doGoodsCategoryEdit(data: any) {
    return request({
        url: '/goodsCategory/doEdit',
        method: 'post',
        data,
    })
}

export function doGoodsCategoryDelete(data: any) {
    return request({
        url: '/goodsCategory/doDelete',
        method: 'post',
        data,
    })
}

import request from '/@/utils/request'

export function getGoodsAttributeList(params?: any) {
    return request({
        url: '/goodsAttribute/getList',
        method: 'get',
        params,
    })
}

export function getGoodsAttributeDetail(params?: any) {
    return request({
        url: '/goodsAttribute/getDetail',
        method: 'get',
        params,
    })
}

export function doGoodsAttributeEdit(data: any) {
    return request({
        url: '/goodsAttribute/doEdit',
        method: 'post',
        data,
    })
}

export function doGoodsAttributeDelete(data: any) {
    return request({
        url: '/goodsAttribute/doDelete',
        method: 'post',
        data,
    })
}

export function doGoodsAttributeValueEdit(data: any) {
    return request({
        url: '/goodsAttribute/doEditValue',
        method: 'post',
        data,
    })
}

export function doGoodsAttributeValueDelete(data: any) {
    return request({
        url: '/goodsAttribute/doDeleteValue',
        method: 'post',
        data,
    })
}

import request from '/@/utils/request'

import { BASE_API } from '/@/api/devlocal/api'

import { IDelImgQueryReq, IImageQueryReq, IProgressQueryReq, ProgressImgSort } from '/@/type/progress/progressType'

/**
 * 获取新品进度管理数据
 * @param params 
 * @returns 
 */
export function getList(params?: IProgressQueryReq) {
    return request({
      url: `${BASE_API}/progress/list`,
      method: 'get',
      params,
    })
  }
  /**
   * 图片上传请求
   */
  export function uploadFile(data: FormData) {
    return request({
      url: `${BASE_API}/progress/upload`,
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data,
    })
  }
  /**
   * 图片删除功能
   */
  export function deleteImage(data: FormData) {
    return request({
      url: `${BASE_API}/progress/del/image`,
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data
    })
  }
  /**
   * 拖拽修改图片排序
   */
  export function updateProgressSort(data?: ProgressImgSort) {
    return request({
      url: `${BASE_API}/progress/img/sort`,
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data,
    })
  }
/**
 * 新品进度参数类型
 */
export interface IProgressQueryReq {
    pageNo: number
    pageSize: number
    productKeyWord?: string
    status: number
}
/**
 * 每个图片的类型
 */
export interface imageList {
    imageId?: number
    imageUrl?: string
    url?: string
    name?: number
}
/**
 * 新品进度类型
 */
export interface IProgress{
    // 优先级
    priority: number
    // 示例图片列表
    imageList: imageList[]
    // 产品名
    product: string 
    // OEM
    oem: string 
    // 立项日期
    createTime: string
    // 当前阶段
    currentPhaseStatus: string 
    // 产品推进日志
    progressLog: string 
    // 备注
    remark: string 
    // 目标月销
    targetMonthlySales: string 
    // 参与人员
    sharerName: string 
    // 新款评估编号
    evaluationId: string 
}
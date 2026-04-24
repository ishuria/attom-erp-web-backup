export const taskTypeOption = [
  { label: '老品优化', value: '老品优化' },
  { label: '新品任务', value: '新品任务' },
  { label: '临时任务', value: '临时任务' },
  { label: '设计任务', value: '设计任务' },
]
export const productClassificationOption = [
  { label: '精品', value: 0 },
  { label: '精铺', value: 1 },
  { label: '铺货', value: 2 },
]
export const designTypeOption = [
  { label: '基础图片', value: 0 },
  { label: '建模', value: 1 },
  { label: '渲染', value: 5 },
  { label: 'A+', value: 2 },
  { label: '视频', value: 3 },
  { label: '说明书/包装', value: 4 },
  { label: '配色设计', value: 6 },
  { label: '产品平面设计', value: 7 },
]

export const getTaskTypeColor = (taskType: string) => {
  switch (taskType) {
    case '新品任务':
      return 'success' // 绿色
    case '老品任务':
      return 'primary' // 蓝色
    case '临时任务':
      return 'warning' // 橙色
    case '设计任务':
      return 'danger' // 红色
    default:
      return 'info' // 灰色
  }
}
interface ColumnConfig {
  label: string
  prop: string
  dataKey?: string
  baseWidth?: number
  isSpecial?: boolean
}
export const columnConfigs: ColumnConfig[] = [
  { label: '基础图片', prop: 'basePicture', dataKey: '_basePicture', baseWidth: 100 },
  { label: '建模', prop: 'modeling', dataKey: '_modeling', baseWidth: 100 },
  { label: '渲染', prop: 'rendering', dataKey: '_rendering', baseWidth: 100 },
  { label: 'A+', prop: 'aAdd', dataKey: '_aAdd', baseWidth: 90 },
  { label: '视频', prop: 'video', dataKey: '_video', baseWidth: 90 },
  { label: '说明书/包装', prop: 'instructionManual', dataKey: '_instructionManual', baseWidth: 120 },
  { label: '配色设计', prop: 'colorDesign', dataKey: '_colorDesign', baseWidth: 100 },
  { label: '产品平面设计', prop: 'productPlaneDesign', dataKey: '_productPlaneDesign', baseWidth: 120 },
  {
    label: '发布人',
    prop: 'publisherPersonName',
    isSpecial: true,
  },
  { label: '产品经理', prop: 'productManager', dataKey: '_productManager', baseWidth: 100 },
  { label: '产品设计', prop: 'productDesign', dataKey: '_productDesign', baseWidth: 100 },
  { label: '运营', prop: 'operation', dataKey: '_operation', baseWidth: 100 },
]

export const approvalFlowColumnConfigs: ColumnConfig[] = [
  { label: '基础图片', prop: 'basePicture', dataKey: '_basePicture', baseWidth: 100 },
  { label: '建模', prop: 'modeling', dataKey: '_modeling', baseWidth: 100 },
  { label: '渲染', prop: 'rendering', dataKey: '_rendering', baseWidth: 100 },
  { label: 'A+', prop: 'aAdd', dataKey: '_aAdd', baseWidth: 90 },
  { label: '视频', prop: 'video', dataKey: '_video', baseWidth: 90 },
  { label: '说明书/包装', prop: 'instructionManual', dataKey: '_instructionManual', baseWidth: 120 },
  { label: '配色设计', prop: 'colorDesign', dataKey: '_colorDesign', baseWidth: 100 },
  { label: '产品平面设计', prop: 'productPlaneDesign', dataKey: '_productPlaneDesign', baseWidth: 120 },
  {
    label: '发布人',
    prop: 'publisherPersonName',
    isSpecial: true,
  },
]

export const splitUsernames = (usernames = '') => {
  return usernames
    .split(/[,，、]+/)
    .map((username) => username.trim())
    .filter(Boolean)
}

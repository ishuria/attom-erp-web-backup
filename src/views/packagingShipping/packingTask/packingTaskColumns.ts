/**
 * 打包任务表格列配置
 * visibleInTabs: 数组，表示在哪些tab中显示该列
 * tab名称映射: 7=全部, 1=待打包, 5=进行中, 2=已完成, 3=零头, 4=售后, 0=未到货
 */

export interface PackingTaskColumn {
  key: string
  label: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  type?: 'selection'
  visibleInTabs: number[] // 在哪些tab中显示
  customSlot?: boolean // 是否需要自定义插槽
}

export const packingTaskColumns: PackingTaskColumn[] = [
  {
    key: 'selection',
    label: '',
    type: 'selection',
    fixed: 'left',
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'sendDate',
    label: '发货日期',
    prop: 'sendDate',
    width: 115,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'po',
    label: 'PO',
    prop: 'po',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'totalOrderQuantity',
    label: '订单总数',
    prop: 'totalOrderQuantity',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'releaseDate',
    label: '订货日期',
    prop: 'releaseDate',
    width: 120,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'sendSite',
    label: '站点',
    prop: 'sendSite',
    width: 145,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'signDay',
    label: '已签收天数',
    prop: 'signDay',
    width: 110,
    visibleInTabs: [7, 1], // 只在"全部"和"待打包"显示
    customSlot: true,
  },
  {
    key: 'productImage',
    label: '产品图片',
    width: 75,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'sku',
    label: 'SKU',
    prop: 'sku',
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'status',
    label: '到货状态',
    prop: 'status',
    width: 100,
    visibleInTabs: [7], // 只在"全部"显示
    customSlot: true,
  },
  {
    key: 'priorityPackaging',
    label: '优先打包',
    prop: 'priorityPackaging',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'packageTaskCount',
    label: '任务数',
    prop: 'packageTaskCount',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'signCount',
    label: '签收数',
    prop: 'signCount',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'recommendCount',
    label: '推荐数量',
    prop: 'recommendCount',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'productCount',
    label: '已装箱数',
    prop: 'productCount',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'requirePhoto',
    label: '需拍照',
    prop: 'requirePhoto',
    width: 90,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'magnetic',
    label: '带磁',
    prop: 'magnetic',
    minWidth: 70,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'woodenProduct',
    label: '木制品',
    prop: 'woodenProduct',
    minWidth: 70,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'toy',
    label: '玩具',
    prop: 'toy',
    minWidth: 70,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'seasonal',
    label: '应季产品',
    prop: 'seasonal',
    minWidth: 70,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'qualityCheckStatus',
    label: '清点质检',
    prop: 'qualityCheckStatus',
    minWidth: 100,
    visibleInTabs: [1], // 只在"待打包"显示
    customSlot: true,
  },
  {
    key: 'actualCompletionCount',
    label: '实际完成数量',
    prop: 'actualCompletionCount',
    width: 130,
    visibleInTabs: [7, 1, 5, 2, 3, 4], // 不在"未到货"显示
  },
  {
    key: 'packageRemarkList',
    label: '打包注意事项',
    prop: 'packageRemarkList',
    minWidth: 250,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
  {
    key: 'productManager',
    label: '产品经理',
    prop: 'productManager',
    width: 100,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
  },
  {
    key: 'operation',
    label: '操作',
    fixed: 'right',
    width: 185,
    visibleInTabs: [7, 1, 5, 2, 3, 4, 0],
    customSlot: true,
  },
]

/**
 * 根据tab名称获取该tab应该显示的列
 */
export function getColumnsForTab(tabName: number): PackingTaskColumn[] {
  return packingTaskColumns.filter((col) => col.visibleInTabs.includes(tabName))
}

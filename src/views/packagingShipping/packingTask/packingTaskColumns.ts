/**
 * 打包任务表格列配置
 * visibleInTabs: 该列在哪些 tab 显示，元素用 {@link PackingTaskTab} 枚举
 */

/** 打包任务页面 tab 编码（与后端 status / activeName 对应） */
export enum PackingTaskTab {
  NOT_ARRIVED = 0,
  PENDING = 1,
  COMPLETED = 2,
  REMAINDER = 3,
  AFTER_SALES = 4,
  TASKING = 5,
  ALL = 7,
  PENDING_NEW_INSPECTION = -1,
}

/** 除「未到货」「待新品质检」外的常规业务 tab */
export const TABS_ALL: PackingTaskTab[] = [
  PackingTaskTab.ALL,
  PackingTaskTab.PENDING,
  PackingTaskTab.TASKING,
  PackingTaskTab.COMPLETED,
  PackingTaskTab.REMAINDER,
  PackingTaskTab.AFTER_SALES,
  PackingTaskTab.NOT_ARRIVED,
]

/** 不在「未到货」展示的列共用此集合 */
export const TABS_EXCLUDE_NOT_ARRIVED: PackingTaskTab[] = TABS_ALL.filter((t) => t !== PackingTaskTab.NOT_ARRIVED)

export interface PackingTaskColumn {
  key: string
  label: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  type?: 'selection'
  visibleInTabs: PackingTaskTab[]
  customSlot?: boolean // 是否需要自定义插槽
  sortable?: boolean | 'custom'
}

export const packingTaskColumns: PackingTaskColumn[] = [
  {
    key: 'selection',
    label: '',
    type: 'selection',
    fixed: 'left',
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'sendDate',
    label: '发货日期',
    prop: 'sendDate',
    width: 115,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'po',
    label: 'PO',
    prop: 'po',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'totalOrderQuantity',
    label: '订单总数',
    prop: 'totalOrderQuantity',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'releaseDate',
    label: '订货日期',
    prop: 'releaseDate',
    width: 120,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'sendSite',
    label: '站点',
    prop: 'sendSite',
    width: 145,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'isClaimable',
    label: '可认领',
    prop: 'isClaimable',
    width: 90,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'signDay',
    label: '已签收天数',
    prop: 'signDay',
    width: 110,
    visibleInTabs: [PackingTaskTab.ALL, PackingTaskTab.PENDING],
    customSlot: true,
  },
  {
    key: 'productImage',
    label: '产品图片',
    width: 75,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'sku',
    label: 'SKU',
    prop: 'sku',
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'status',
    label: '到货状态',
    prop: 'status',
    width: 100,
    visibleInTabs: [PackingTaskTab.ALL],
    customSlot: true,
  },
  {
    key: 'barcodeStatus',
    label: '条形码状态',
    prop: 'barcodeStatus',
    width: 130,
    visibleInTabs: [PackingTaskTab.ALL],
    customSlot: true,
  },
  {
    key: 'priorityPackaging',
    label: '优先打包',
    prop: 'priorityPackaging',
    width: 100,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'packageTaskCount',
    label: '任务数',
    prop: 'packageTaskCount',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'signCount',
    label: '签收数',
    prop: 'signCount',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'recommendCount',
    label: '推荐数量',
    prop: 'recommendCount',
    width: 120,
    visibleInTabs: TABS_ALL,
    sortable: 'custom',
  },
  {
    key: 'productCount',
    label: '已装箱数',
    prop: 'productCount',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'requirePhoto',
    label: '需拍照',
    prop: 'requirePhoto',
    width: 90,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'magnetic',
    label: '带磁',
    prop: 'magnetic',
    minWidth: 70,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'woodenProduct',
    label: '木制品',
    prop: 'woodenProduct',
    minWidth: 70,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'toy',
    label: '玩具',
    prop: 'toy',
    minWidth: 70,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'seasonal',
    label: '应季产品',
    prop: 'seasonal',
    minWidth: 70,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'qualityCheckStatus',
    label: '清点质检',
    prop: 'qualityCheckStatus',
    minWidth: 100,
    visibleInTabs: [PackingTaskTab.PENDING],
    customSlot: true,
  },
  {
    key: 'actualCompletionCount',
    label: '实际完成数量',
    prop: 'actualCompletionCount',
    width: 130,
    visibleInTabs: TABS_EXCLUDE_NOT_ARRIVED,
  },
  {
    key: 'verifyStatus',
    label: '扫码验证',
    prop: 'verifyStatus',
    width: 140,
    visibleInTabs: [PackingTaskTab.TASKING],
    customSlot: true,
  },
  {
    key: 'packageRemarkList',
    label: '打包注意事项',
    prop: 'packageRemarkList',
    minWidth: 250,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
  {
    key: 'productManager',
    label: '产品经理',
    prop: 'productManager',
    width: 100,
    visibleInTabs: TABS_ALL,
  },
  {
    key: 'operation',
    label: '操作',
    fixed: 'right',
    width: 185,
    visibleInTabs: TABS_ALL,
    customSlot: true,
  },
]

/**
 * 根据 tab 获取该 tab 应该显示的列
 */
export function getColumnsForTab(tab: PackingTaskTab): PackingTaskColumn[] {
  return packingTaskColumns.filter((col) => col.visibleInTabs.includes(tab))
}

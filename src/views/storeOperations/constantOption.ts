export const opeClassOption = [
  {
    label: '每日关注',
    value: 0
  },
  {
    label: '停产',
    value: 1
  }
]

export const filterShowOption = [
  {
    label: '全部',
    value: -1
  },
  {
    label: '手动输入',
    value: 0
  },
  {
    label: '系统抓取',
    value: 1
  },
  {
    label: '广告',
    value: 2
  }
]

export const levelOption = [
  {
    label: 'SKU',
    value: 0
  },
  {
    label: 'ASIN',
    value: 1
  },
  {
    label: '父体ASIN',
    value: 2
  }
]

export const dateOption = [
  {
    label: '30天',
    value: 0
  },
  {
    label: '60天',
    value: 1
  },
  {
    label: '180天',
    value: 2
  },
  {
    label: '360天',
    value: 3
  },
  {
    label: '本月',
    value: 4
  },
  {
    label: '上月',
    value: 5
  },
  {
    label: '全部',
    value: -1
  }
]

export const adOption = [
  {
    label: '所有广告组之和',
    value: 0
  }
]

export const dayOption = [
  {
    label: '7天',
    value: 0
  },
  {
    label: '15天',
    value: 1
  },
  {
    label: '30天',
    value: 2
  },
  {
    label: '60天',
    value: 3
  },
]

export const adStatusOption = [
  {
    label: '开',
    value: 0
  },
  {
    label: '关',
    value: 1
  }
]

export const keyWordTrendOption = [
  {
    label: '全部',
    value: -1
  },
  {
    label: '近半年',
    value: 0
  },
  {
    label: '近一年',
    value: 1
  },
  {
    label: '近两年',
    value: 2
  }
]

export const pieSelectOption = [
  {
    label: '花费',
    value: 0
  },
  {
    label: '展示量',
    value: 1
  },
  {
    label: '点击量',
    value: 2
  },
  {
    label: '订单数',
    value: 3
  },
]

export const highLowMap: Record<number, string> = {
  0: '低点击不出单',
  1: '高点击不出单',
  2: '低ACOS',
  3: '高ACOS'
}

export const pieSelectMap: Record<number, string> = {
  0: 'spend',
  1: 'impressions',
  2: 'clicks',
  3: 'orders'
}
export const pieSelectLabelMap: Record<number, string> = {
  0: '花费',
  1: '展示量',
  2: '点击量',
  3: '订单数'
}

export const colorList = [
  '#52bfff',
  '#ff8fa5',
  '#99db70',
  '#ce82fa',
  '#ffdd36',
  '#ffac78',
  '#60e6e6',
  '#55b339',
  '#d6c9ff',
  '#bdff52',
  '#a187ff',
  '#f799f4',
  '#a8e1ff',
  '#ffdab8',
  '#80ceff',
  '#52ffcb',
  '#52bfff',
]

export const storageAgeColorList = [
  '#99db70',
  '#52bfff',
  '#ce82fa',
  '#ffdd36',
  '#ff8fa5',
]

export const card4Option = [
  {
    label: '前7天',
    value: 0
  },
  {
    label: '前30天',
    value: 1
  },
  {
    label: '本月',
    value: 2
  },
  {
    label: '上月',
    value: 3
  },
  {
    label: '自定义',
    value: 4
  },
]

export const sizeSourceOption = [
  {
    label: '自量',
    value: 0
  },
  {
    label: '亚马逊',
    value: 1
  },
]

export const months = [
  { label: '1月', prop: 'Jan' },
  { label: '2月', prop: 'Feb' },
  { label: '3月', prop: 'Mar' },
  { label: '4月', prop: 'Apr' },
  { label: '5月', prop: 'May' },
  { label: '6月', prop: 'Jun' },
  { label: '7月', prop: 'Jul' },
  { label: '8月', prop: 'Aug' },
  { label: '9月', prop: 'Sep' },
  { label: '10月', prop: 'Oct' },
  { label: '11月', prop: 'Nov' },
  { label: '12月', prop: 'Dec' },
]

export const orderColumns = [
  {
    label: '图片',
    prop: 'asinImgUrl',
    width: 75,
    isFixed: 'left'
  },
  {
    label: 'ASIN',
    prop: 'asin',
    minWidth: 170,
    isFixed: 'left'
  },
  {
    label: 'SKU',
    prop: 'sku',
    minWidth: 140,
    isFixed: 'left'
  },
  {
    label: '今销量',
    prop: 'currentSalesNumber',
    minWidth: 90,
  },
  {
    label: '站点',
    prop: 'siteName',
    minWidth: 130,
  },
  {
    label: '销量趋势',
    prop: 'trend',
    minWidth: 180,
  },
  {
    label: '库存可售',
    prop: 'esAvailableSaleDay',
    minWidth: 100,
  },
  {
    label: '可售含在途',
    prop: 'esAvailableSaleDayTotal',
    minWidth: 110,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    minWidth: 90,
  },
  {
    label: '广告',
    prop: 'advertisementStatus',
    minWidth: 90,
  },
  {
    label: '运营',
    prop: 'operationUserName',
    minWidth: 150,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    minWidth: 150,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    minWidth: 90,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    minWidth: 100,
  },
  {
    label: '月净利润',
    prop: 'monthNetProfit',
    minWidth: 100,
  },
  {
    label: '库龄',
    prop: 'inventoryAge',
    minWidth: 90,
  },
  {
    label: '剩余库存',
    prop: '',
    minWidth: 100,
  },
  {
    label: '接收中',
    prop: 'acceptingCount',
    minWidth: 90,
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    minWidth: 100,
  },
  {
    label: '总入库',
    prop: 'inboundStorageTotal',
    minWidth: 90,
  },
  {
    label: '订货#',
    prop: 'orderCount',
    minWidth: 90,
  },
  {
    label: '计划#',
    prop: 'planPoPurchaseSkuNumber',
    minWidth: 90,
  },
  {
    label: '签收',
    prop: 'quantityReceived',
    minWidth: 90,
  },
  {
    label: '推荐#',
    prop: 'recommendCount',
    minWidth: 90,
  },
  {
    label: '装箱#',
    prop: 'encasementCount',
    minWidth: 90,
  },
  {
    label: '最晚补货',
    prop: 'latestRestock',
    minWidth: 90,
  },
  {
    label: '今补',
    prop: 'nowSupplement',
    minWidth: 90,
  },
  {
    label: '今补广',
    prop: 'nowSupplementAdv',
    minWidth: 90,
  },
  {
    label: '操作',
    prop: '',
    minWidth: 130,
  },
  {
    label: '当前售价',
    prop: 'sellingPrice',
    minWidth: 100,
  },
  {
    label: '毛利率',
    prop: 'grossProfit',
    minWidth: 100,
  },
  {
    label: '半年有货率',
    prop: 'availableRate',
    minWidth: 110,
  },
  {
    label: '月广告%',
    prop: 'monthAdv',
    minWidth: 110,
  },
  {
    label: '月ACOS',
    prop: 'monthAcos',
    minWidth: 100,
  },
  {
    label: '月TACOS',
    prop: 'monthTacos',
    minWidth: 100,
  },
  {
    label: '月退货%',
    prop: 'monthReturnGoods',
    minWidth: 100,
  },
]
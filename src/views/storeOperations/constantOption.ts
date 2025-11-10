export const opeClassOption = [
  {
    label: '每日关注',
    value: 0,
  },
  {
    label: '停产',
    value: 1,
  },
]

export const filterShowOption = [
  {
    label: '全部',
    value: -1,
  },
  {
    label: '手动输入',
    value: 0,
  },
  {
    label: '系统抓取',
    value: 1,
  },
  {
    label: '广告',
    value: 2,
  },
]

export const levelOption = [
  {
    label: 'SKU',
    value: 0,
  },
  {
    label: 'ASIN',
    value: 1,
  },
  {
    label: '父体ASIN',
    value: 2,
  },
]

export const dateOption = [
  {
    label: '30天',
    value: 0,
  },
  {
    label: '60天',
    value: 1,
  },
  {
    label: '180天',
    value: 2,
  },
  {
    label: '360天',
    value: 3,
  },
  {
    label: '本月',
    value: 4,
  },
  {
    label: '上月',
    value: 5,
  },
  {
    label: '全部',
    value: -1,
  },
]

export const adOption = [
  {
    label: '所有广告组之和',
    value: 0,
  },
]

export const dayOption = [
  {
    label: '7天',
    value: 0,
  },
  {
    label: '15天',
    value: 1,
  },
  {
    label: '30天',
    value: 2,
  },
  {
    label: '60天',
    value: 3,
  },
]

export const adStatusOption = [
  {
    label: '开',
    value: 1,
  },
  {
    label: '关',
    value: 0,
  },
]

export const pieSelectOption = [
  {
    label: '花费',
    value: 0,
  },
  {
    label: '展示量',
    value: 1,
  },
  {
    label: '点击量',
    value: 2,
  },
  {
    label: '订单数',
    value: 3,
  },
]

export const highLowMap: Record<number, string> = {
  0: '低点击不出单',
  1: '高点击不出单',
  2: '低ACOS',
  3: '高ACOS',
}

export const pieSelectMap: Record<number, string> = {
  0: 'spend',
  1: 'impressions',
  2: 'clicks',
  3: 'orders',
}
export const pieSelectLabelMap: Record<number, string> = {
  0: '花费',
  1: '展示量',
  2: '点击量',
  3: '订单数',
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

export const storageAgeColorList = ['#99db70', '#52bfff', '#ce82fa', '#ffdd36', '#ff8fa5']

export const card4Option = [
  {
    label: '前7天',
    value: 0,
  },
  {
    label: '前30天',
    value: 1,
  },
  {
    label: '本月',
    value: 2,
  },
  {
    label: '上月',
    value: 3,
  },
  {
    label: '自定义',
    value: 4,
  },
]

export const sizeSourceOption = [
  {
    label: '自量',
    value: 0,
  },
  {
    label: '亚马逊',
    value: 1,
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
    isFixed: 'left',
  },
  {
    label: 'ASIN',
    prop: 'asin',
    minWidth: 170,
    isFixed: 'left',
  },
  {
    label: '今销量',
    prop: 'currentSalesNumber',
    minWidth: 75,
  },
  {
    label: '销量趋势',
    prop: 'trend',
    minWidth: 180,
  },
  {
    label: '库存可售',
    prop: 'esAvailableSaleDay',
    minWidth: 75,
  },
  {
    label: '可售含在途',
    prop: 'esAvailableSaleDayTotal',
    minWidth: 80,
    sortable: true,
  },
  {
    label: '断货',
    prop: 'outOfStock',
    minWidth: 60,
  },
  {
    label: '广告',
    prop: 'advertisementStatus',
    minWidth: 60,
  },
  {
    label: '运营分类',
    prop: 'operationTypeId',
    minWidth: 150,
  },
  {
    label: '库龄',
    prop: 'storageAge',
    minWidth: 180,
  },
  {
    label: '剩余库存',
    prop: '',
    minWidth: 95,
  },
  {
    label: '接收中',
    prop: 'acceptingCount',
    minWidth: 75,
  },
  {
    label: '最近入库',
    prop: 'recentlyInboundStorage',
    minWidth: 95,
  },
  {
    label: '总入库',
    prop: 'inboundStorageTotal',
    minWidth: 75,
  },
  {
    label: '订货#',
    prop: 'orderCount',
    minWidth: 70,
  },
  {
    label: '计划#',
    prop: 'planPoPurchaseSkuNumber',
    minWidth: 90,
    sortable: true,
  },
  {
    label: '签收',
    prop: 'quantityReceived',
    minWidth: 60,
  },
  {
    label: '推荐#',
    prop: 'recommendCount',
    minWidth: 90,
    sortable: true,
  },
  {
    label: '发货#',
    prop: 'encasementCount',
    minWidth: 90,
    sortable: true,
  },
  {
    label: '最晚补货',
    prop: 'latestRestock',
    minWidth: 115,
  },
  {
    label: '原始今补',
    prop: 'originalNowSupplement',
    minWidth: 120,
    sortable: true,
  },
  {
    label: '今补',
    prop: 'nowSupplement',
    minWidth: 60,
  },
  {
    label: 'VOC满意度',
    prop: 'vocSatisfaction',
    minWidth: 130,
  },
  {
    label: '月退货%',
    prop: 'monthReturnGoods',
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
    minWidth: 95,
  },
  {
    label: '毛利率',
    prop: 'grossProfit',
    minWidth: 80,
  },
  {
    label: '月销量',
    prop: 'monthSalesVolume',
    minWidth: 100,
    sortable: true,
  },
  {
    label: '月销售额',
    prop: 'monthSalesPrice',
    minWidth: 95,
  },
  {
    label: '月净利润',
    prop: 'monthNetProfit',
    minWidth: 95,
  },
  {
    label: '月净利率',
    prop: 'monthNetProfitMargin',
    minWidth: 95,
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
    minWidth: 95,
  },
  {
    label: '月TACOS',
    prop: 'monthTacos',
    minWidth: 100,
  },
  {
    label: 'SKU',
    prop: 'sku',
    minWidth: 140,
  },
  {
    label: '站点',
    prop: 'siteName',
    minWidth: 150,
  },
  {
    label: '运营',
    prop: 'operationUserName',
    minWidth: 85,
  },
  {
    label: '今补广',
    prop: 'nowSupplementAdv',
    minWidth: 75,
  },
]

export const trendOverviewColumns = [
  {
    label: '日期',
    prop: 'date',
    disableCheck: true,
    checked: true,
    width: 115,
    isFixed: 'left',
  },
  {
    label: '销售额(订单)',
    prop: 'amount',
    checked: true,
    minWidth: 100,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: '销量(订单)',
    prop: 'volume',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告销量',
    prop: 'adSales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自然销量',
    prop: 'organicSales',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告销售额',
    prop: 'adSalesAmount',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: '广告花费',
    prop: 'spend',
    checked: true,
    minWidth: 100,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: '净利润(订单)',
    prop: 'grossOrderProfit',
    checked: true,
    minWidth: 100,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: '预计下月仓储费',
    prop: 'estimatedStorageCostNextMonth',
    checked: true,
    minWidth: 140,
  },
  {
    label: '退款金额',
    prop: 'returnAmount',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  // {
  //   label: '毛利润',
  //   prop: 'grossProfit',
  //   checked: true,
  //   minWidth: 90,
  // },
  {
    label: '点击成本',
    prop: 'clickCost',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: '客单价',
    prop: 'averageOrderValue',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${_row.currencyIcon}${cellValue}` : ''
    },
  },
  {
    label: 'CPA(获客成本)',
    prop: 'cpa',
    checked: true,
    minWidth: 90,
  },
  {
    label: '广告转化率',
    prop: 'adConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '自然转化率',
    prop: 'organicConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '综合转化率',
    prop: 'totalConversionRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '退货率',
    prop: 'returnRate',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '退款率',
    prop: 'refundRate',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '净利润率',
    prop: 'netProfitMargin',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'TACOS',
    prop: 'tacos',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'ACOS',
    prop: 'acos',
    checked: true,
    minWidth: 90,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '广告点击率',
    prop: 'adClickRate',
    checked: true,
    minWidth: 110,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '总访客',
    prop: 'sessionsTotal',
    checked: true,
    minWidth: 90,
  },
  {
    label: 'PC端访客',
    prop: 'sessions',
    checked: true,
    minWidth: 110,
  },
  {
    label: '移动端访客',
    prop: 'sessionsMobile',
    checked: true,
    minWidth: 110,
  },
  {
    label: '自然点击',
    prop: 'organicClicks',
    checked: true,
    minWidth: 100,
  },
  {
    label: '自然点击占比',
    prop: 'organicClickShare',
    checked: true,
    minWidth: 130,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: '广告点击占比',
    prop: 'adClickShare',
    checked: true,
    minWidth: 130,
    formatter: (_row: any, _column: any, cellValue: any) => {
      return cellValue != null ? `${cellValue}%` : ''
    },
  },
  {
    label: 'Rating',
    prop: 'lastStar',
    checked: true,
    minWidth: 100,
  },
  {
    label: '库存',
    prop: 'stock',
    checked: true,
    minWidth: 130,
  },
  {
    label: '小类排名',
    prop: 'smallRank',
    checked: true,
    minWidth: 100,
    formatter: (_row: any, _column: any, cellValue: any) => {
      if (Array.isArray(cellValue)) {
        // 如果是数组，显示所有类别和排名，用逗号分隔
        return cellValue.map((item: { category: string; smallRank: number }) => `${item.smallRank}`).join(',')
      }
      return cellValue != null ? cellValue : ''
    },
  },
  {
    label: '大类排名',
    prop: 'largeRank',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告点击',
    prop: 'clicks',
    checked: true,
    minWidth: 100,
  },
  {
    label: '广告展现量',
    prop: 'impressions',
    checked: true,
    minWidth: 110,
  },
  {
    label: '退货量',
    prop: 'returnGoodsCount',
    checked: true,
    minWidth: 100,
  },
  {
    label: '销售额(利润报表)',
    prop: 'totalSalesAmount',
    checked: true,
    minWidth: 130,
  },
  {
    label: '净利润(利润报表)',
    prop: 'grossProfit',
    checked: true,
    minWidth: 130,
  },
]

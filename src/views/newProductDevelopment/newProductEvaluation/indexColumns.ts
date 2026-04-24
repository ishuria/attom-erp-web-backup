export interface ColumnConfig {
  label: string
  prop: string
  minWidth: number
}
export const indexColumns: ColumnConfig[] = [
  {
    label: '编号',
    prop: 'idNo',
    minWidth: 60,
  },
  {
    label: '评估人',
    prop: 'evaluatorName',
    minWidth: 100,
  },
  {
    label: '评估日期',
    prop: 'evaluateDate',
    minWidth: 115,
  },
  {
    label: '国家',
    prop: 'countryDisplay',
    minWidth: 115,
  },
  {
    label: '中文品名',
    prop: 'productNameZh',
    minWidth: 100,
  },
  {
    label: '亚马逊前台关键词',
    prop: 'amazonFrontendKeywords',
    minWidth: 200,
  },
  {
    label: '亚马逊后台关键词',
    prop: 'amazonBackendKeywords',
    minWidth: 200,
  },
  {
    label: '年市场容量',
    prop: 'marketVolume',
    minWidth: 130,
  },
  {
    label: '关键词趋势',
    prop: 'keywordTrend',
    minWidth: 130,
  },
  {
    label: '头部个数',
    prop: 'productsCount',
    minWidth: 100,
  },
  {
    label: 'CPC$',
    prop: 'cpc',
    minWidth: 100,
  },
  {
    label: '自然单',
    prop: 'grossProfitAndLoss',
    minWidth: 100,
  },
  {
    label: '平均转化',
    prop: 'avgConversionRate',
    minWidth: 100,
  },
  {
    label: '平均售价',
    prop: 'averageSellingPrice',
    minWidth: 100,
  },
  {
    label: '供求评分',
    prop: 'supplyScore',
    minWidth: 100,
  },
  {
    label: '首页评分',
    prop: 'keyWordScore',
    minWidth: 100,
  },
  {
    label: '总分',
    prop: 'finalScore',
    minWidth: 80,
  },
  {
    label: '来源',
    prop: 'productSource',
    minWidth: 100,
  },
]

export const estimatedCostAccountingColumns = [
  {
    label: '日期',
    prop: 'createTime',
    minWidth: 110,
  },
  {
    label: '站点',
    prop: 'site',
  },
  {
    label: '图片',
    prop: 'imgUrl',
  },
  {
    label: '产品描述',
    prop: 'desc',
  },
  {
    label: '价格信息',
    prop: 'priceInfo',
  },
  {
    label: '1688链接',
    prop: 'url1688',
  },
  {
    label: '产品价格￥',
    prop: 'price',
  },
  {
    label: '长',
    prop: 'length',
  },
  {
    label: '宽',
    prop: 'width',
  },
  {
    label: '高',
    prop: 'height',
  },
  {
    label: '重量',
    prop: 'weight',
  },
  {
    label: '尾程',
    prop: 'lastMile',
  },
  {
    label: '头程',
    prop: 'firstMile',
  },
  {
    label: '打包',
    prop: 'packaging',
  },
  {
    label: '头程渠道',
    prop: 'firstMileChannel',
  },
  {
    label: '售价',
    prop: 'sellingPrice',
  },
  {
    label: '毛利率',
    prop: 'grossMarginRate',
  },
  {
    label: 'ROI',
    prop: 'roi',
  },
  {
    label: '重量系数',
    prop: 'weightCoefficient',
  },
  {
    label: '体积系数',
    prop: 'volumeCoefficient',
  },
  {
    label: '关税%',
    prop: 'tariff',
  },
  {
    label: '平台佣金',
    prop: 'platformCommission',
  },
  {
    label: '仓储费2个月$',
    prop: 'storageFee',
  },
]

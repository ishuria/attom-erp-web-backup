export const sharedColumns = [
  {
    label: '用户id',
    prop: 'userID',
  },
  {
    label: '用户名',
    prop: 'userName',
  },
  {
    label: '操作',
    prop: 'isShare',
  },
]

export const indexColumns = [
  {
    label: '编号',
    prop: 'idNo',
    minWidth: 50,
  },
  {
    label: '评估人',
    prop: 'evaluatorName',
  },
  {
    label: '评估日期',
    prop: 'evaluateDate',
    minWidth: 110,
  },
  {
    label: '中文品名',
    prop: 'productNameZh',
    minWidth: 150,
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
  },
  {
    label: '头部个数',
    prop: 'productsCount',
    minWidth: 80,
  },
  {
    label: 'CPC$',
    prop: 'cpc',
    minWidth: 70,
  },
  {
    label: '30毛利盈亏自然单占比',
    prop: 'grossProfitAndLoss',
  },
  {
    label: '平均转化',
    prop: 'avgConversionRate',
    minWidth: 80,
  },
  {
    label: '平均售价',
    prop: 'averageSellingPrice',
    minWidth: 80,
  },
  {
    label: '供求评分',
    prop: 'supplyScore',
  },
  {
    label: '关键词首页评分',
    prop: 'keyWordScore',
  },
  {
    label: '来源',
    prop: 'productSource',
  },
]

export const scoreDetialColumns = [
  {
    label: '描述',
    prop: 'desc',
  },
  {
    label: '数量',
    prop: 'quantity',
  },
  {
    label: '分数',
    prop: 'score',
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

export const idxKeyWordOptions = [
  {
    value: '0',
    label: '全部',
  },
  {
    value: '1',
    label: '近半年',
  },
  {
    value: '2',
    label: '近一年',
  },
  {
    value: '3',
    label: '近两年',
  },
]

export const estimatedCostAccountingSiteColumns = [
    {
        value: '0',
        label: '亚马逊US',
    },
    {
        value: '1',
        label: '亚马逊DE',
    },
    {
        value: '2',
        label: '亚马逊UK',
    },
    {
        value: '3',
        label: '沃尔玛US',
    },
]

export const  firstLegChannelColumns = [
    {
        value: '0',
        label: '头程渠道1',
    },
    {
        value: '1',
        label: '头程渠道2',
    },
    {
        value: '2',
        label: '头程渠道3',
    },
    {
        value: '3',
        label: '头程渠道4',
    },
]


export interface EstimatedCostAccounting{
    id:number,
    createTime:string,
    site:string,
    imgUrl:string,
    desc:string,
    priceInfo:string,
    url1688:string,
    price:number,
    length:number,
    width:number,
    height:number,
    weight:number,
    lastMile:number,
    firstMile:number,
    packaging:number,
    firstMileChannel:string,
    sellingPrice:number,
    grossMarginRate:number,
    roi:number,
    weightCoefficient:number,
    volumeCoefficient:number,
    tariff:number,
    platformCommission:number,
    storageFee:number
}
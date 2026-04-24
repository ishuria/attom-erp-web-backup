import type { FormRules } from 'element-plus'

export const rules = reactive<FormRules<any>>({
  productSource: [{ required: true, message: '产品来源是必填项', trigger: 'blur' }],
  countryId: [{ required: true, message: '国家是必填项', trigger: 'change' }],
  productNameZh: [
    {
      required: true,
      message: '中文品名是必填项',
      trigger: 'blur',
    },
  ],
  amazonFrontendKeywords: [
    {
      required: true,
      message: '亚马逊前台关键词是必填项',
      trigger: 'blur',
    },
  ],
  amazonBackendKeywords: [
    {
      required: true,
      message: '亚马逊后台关键词是必填项',
      trigger: 'blur',
    },
  ],
  amazonListingQuantity: [
    {
      required: true,
      message: '亚马逊listing是必填项',
      trigger: 'blur',
    },
  ],
  searchVolume90Days: [
    {
      required: true,
      message: '90天搜索量是必填项',
      trigger: 'blur',
    },
  ],
  averageSellingPrice: [
    {
      required: true,
      message: '平均售价是必填项',
      trigger: 'blur',
    },
  ],
  averageSales360Days: [
    {
      required: true,
      message: '360天平均销量是必填项',
      trigger: 'blur',
    },
  ],
  top80PercentClickedProductsCount: [
    {
      required: true,
      message: '前80%点击的产品个数是必填项',
      trigger: 'blur',
    },
  ],
  amazonAdCpc: [{ required: true, message: '亚马逊广告单个点击价格$(CPC)是必填项', trigger: 'blur' }],
  categoryAvgConversionRate: [{ required: true, message: '类目平均转化率是必填项', trigger: 'blur' }],
})

export const selectOptions = [
  {
    value: '欧鹭',
    label: '欧鹭',
  },
  {
    value: '亚马逊随机浏览',
    label: '亚马逊随机浏览',
  },
  {
    value: '亚马逊榜单',
    label: '亚马逊榜单',
  },
  {
    value: '1688',
    label: '1688',
  },
  {
    value: '供应商推荐',
    label: '供应商推荐',
  },
  {
    value: '已有产品扩展',
    label: '已有产品扩展',
  },
  {
    value: '随机搜索',
    label: '随机搜索',
  },
]

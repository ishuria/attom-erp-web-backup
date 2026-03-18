export const siteList = [
  {
    label: '亚马逊美国US',
    value: 0,
  },
  {
    label: '亚马逊英国UK',
    value: 1,
  },
  {
    label: '亚马逊德国DE',
    value: 2,
  },
  {
    label: '亚马逊加拿大CA',
    value: 3,
  },
  {
    label: '沃尔玛美国US',
    value: 4,
  },
]

export const currencyNumList = [
  {
    value: 0,
    label: 'RMB',
  },
  {
    value: 1,
    label: 'USD',
  },
  {
    value: 2,
    label: 'EUR',
  },
]
export const invoicingNumList = [
  {
    value: 0,
    label: '专票',
  },
  {
    value: 1,
    label: '普票',
  },
  {
    value: 2,
    label: '无法开票',
  },
]
export type CurrencyCode = 0 | 1 | 2 // 定义币种代码类型

export const currencyMap: Record<CurrencyCode, string> = {
  0: 'RMB',
  1: 'USD',
  2: 'EUR',
}

export const warehouseOption = [
  { label: '自有', value: 0 },
  { label: '供应商', value: 1 },
]
export const statusOption = [
  { label: '正常', value: 0 },
  { label: '停用', value: 1 },
]

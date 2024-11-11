export type siteValue = 0 | 1 | 2 | 3 | 4 | 5; 

export const siteMap: Record<siteValue, string> = {
  0: '亚马逊US美国',
  1: '亚马逊UK英国',
  2: '亚马逊DE德国',
  3: '亚马逊CA加拿大',
  4: '沃尔玛US美国',
  5: '沃尔玛MX墨西哥',
}

export const siteOption = [
  {
    label: '亚马逊US',
    value: 0
  },
  {
    label: '亚马逊DE',
    value: 1
  },
  {
    label: '亚马逊UK',
    value: 2
  },
  {
    label: '亚马逊CA',
    value: 3
  },
  {
    label: '沃尔玛US',
    value: 4
  },
]

export const includeTariffOption = [
  {
    label: '否',
    value: 0
  },
  {
    label: '是',
    value: 1
  },
]

export const printerOption = [
  {
    label: '打印机1',
    value: 0
  },
  {
    label: '打印机2',
    value: 1
  },
]

export const unitOption = [
  {
    label: 'cm/kg',
    value: 1
  },
  {
    label: 'in/Ib',
    value: 2
  },
]
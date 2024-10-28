export type siteValue = 0 | 1 | 2 | 3 | 4; 

export const siteMap: Record<siteValue, string> = {
  0: '亚马逊US',
  1: '亚马逊DE',
  2: '亚马逊UK',
  3: '亚马逊CA',
  4: '沃尔玛US'
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
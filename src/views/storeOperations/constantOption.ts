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

export const currencySymbols = new Map([
  ['USD', '$'],  // United States Dollar
  ['CNY', '¥'],  // Chinese Yuan
  ['CAD', 'C$'], // Canadian Dollar
  ['EUR', '€'],  // Euro
  ['GBP', '£'],  // British Pound
  ['JPY', '¥'],  // Japanese Yen
  ['AUD', '$'],  // Australian Dollar
  ['CHF', 'Fr'], // Swiss Franc
  ['INR', '₹'],  // Indian Rupee
  ['MXN', '$'],  // Mexican Peso
  ['SGD', '$'],  // Singapore Dollar
  ['HKD', '$'],  // Hong Kong Dollar
  ['KRW', '₩'],  // South Korean Won
  ['BRL', 'R$'], // Brazilian Real
  ['SEK', 'kr'], // Swedish Krona
  ['NOK', 'kr'], // Norwegian Krone
  ['DKK', 'kr'], // Danish Krone
  ['ZAR', 'R'],  // South African Rand
  ['THB', '฿'],  // Thai Baht
  ['MYR', 'RM'], // Malaysian Ringgit
  ['RUB', '₽'],  // Russian Ruble
])

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
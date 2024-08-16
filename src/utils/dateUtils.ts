// 获取当前日期
export function getCurrentDate(): Date {
  return new Date()
}

// 格式化日期为指定格式
export function formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
  const map: { [key: string]: number } = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in map) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? map[k].toString() : ('00' + map[k]).substr(('' + map[k]).length))
    }
  }

  return format
}

// 获取日期的开始时间 (00:00:00)
export function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

// 获取日期的结束时间 (23:59:59)
export function getEndOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

// 计算日期加上指定天数后的日期
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(date.getDate() + days)
  return result
}

// 计算日期减去指定天数后的日期
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}

// 比较两个日期是否是同一天
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
}

// 获取日期的年份
export function getYear(date: Date): number {
  return date.getFullYear()
}

// 获取日期的月份 (1-12)
export function getMonth(date: Date): number {
  return date.getMonth() + 1
}

// 获取日期的日 (1-31)
export function getDay(date: Date): number {
  return date.getDate()
}

// 计算两个日期之间的天数
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  const diffInTime = date2.getTime() - date1.getTime()
  return Math.round(diffInTime / oneDay)
}

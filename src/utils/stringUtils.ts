export const convertString = (value: number): string => {
  return `${value}`
}

// 处理浮点数精度问题的工具函数
// 将小数转换为百分比数值（如 0.135 -> 13.5），并修复精度问题
export const toPercentage = (value: number) => {
  return Number((value * 100).toFixed(10))
}

export const toDecimal = (value: number) => {
  return Math.round(value * 100) / 10000
}

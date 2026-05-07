// 格式化价格，保留小数位数
export const formattedPrice = (price: string, digits: number = 2) => {
  return parseFloat(price).toFixed(digits)
}
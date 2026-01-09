/**
 * 评分转换规则:
    星星展示规则和亚马逊一致，冒号右边为评分区间：
    5星：    [4.8,5]
    4星半： [4.3,4.8)
    4星：    [3.8,4.3)
    3星半： [3.3,3.8)
    3星：    [2.8,3.3)
    2星半： [2.3,2.8)
    2星：    [1.8,2.3)
    1星半： [1.3,1.8)
    1星：    [0,1.3) && 有评论 展示1星 0 没评论 展示0星
*/
export function getAmazonStars(score: number, commentNumbers: number): number {
  if (score >= 4.8) return 5
  if (score >= 4.3) return 4.5
  if (score >= 3.8) return 4
  if (score >= 3.3) return 3.5
  if (score >= 2.8) return 3
  if (score >= 2.3) return 2.5
  if (score >= 1.8) return 2
  if (score >= 1.3) return 1.5
  if (score >= 0 && commentNumbers > 0) return 1
  return 0
}
export function getAmazonStarsByStar(score: number): number {
  if (score >= 4.8) return 5
  if (score >= 4.3) return 4.5
  if (score >= 3.8) return 4
  if (score >= 3.3) return 3.5
  if (score >= 2.8) return 3
  if (score >= 2.3) return 2.5
  if (score >= 1.8) return 2
  if (score >= 1.3) return 1.5
  if (score >= 0) return 0
  return 0
}
/**
 * @description 处理亚马逊图片变清晰
 * @param url
 */
export const handleImgUrl = (url: string): string => {
  if (url.startsWith('https')) {
    //去掉第一个_后面的到最后一个.前面的
    const start = url.indexOf('_')
    const end = url.lastIndexOf('.')
    if (start !== -1 && end > start) {
      const before = url.substring(0, start) // 左闭右开
      const after = url.substring(end + 1)
      return before + after
    }
  }
  return url
}
/**
 * @description 将小数转化为百分比，保留对应的位数
 * @param value
 * @param num
 * @returns
 */
export function formatPercentage(value: number | null, num: number): string | null {
  if (value == null) return value
  const percentage = (value * 100).toFixed(num) // 将小数转换为百分比，并保留两位小数
  return `${percentage}%`
}

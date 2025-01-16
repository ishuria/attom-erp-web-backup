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
    1星：    [0,1.3)
*/
export function getAmazonStars(score: number) {
  if (score >= 4.8) return 5;
  if (score >= 4.3) return 4.5;
  if (score >= 3.8) return 4;
  if (score >= 3.3) return 3.5;
  if (score >= 2.8) return 3;
  if (score >= 2.3) return 2.5;
  if (score >= 1.8) return 2;
  if (score >= 1.3) return 1.5;
  return 1;
}
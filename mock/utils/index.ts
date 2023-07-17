import mockjs from 'mockjs'

export const { mock, Random } = mockjs

/**
 * @description 随机生成图片url。
 * @returns {string}
 */
function handleRandomImage() {
  return (
    'https://cdn.jsdelivr.net/gh/' +
    'chuzh' +
    'ixin/image' +
    `/table/vab-image-${Random.integer(1, 38)}.jpg`
  )
}

export { handleRandomImage }

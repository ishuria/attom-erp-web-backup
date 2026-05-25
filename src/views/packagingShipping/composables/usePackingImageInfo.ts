import { ref } from 'vue'

const DEFAULT_VISIBLE_COUNT = 3

export const usePackingImageInfo = <T = string>(getImageUrl: (image: T) => string = (image) => String(image ?? '')) => {
  const packingImageInfoVisible = ref<boolean>(false)
  const packingImageInfoList = ref<string[]>([])

  const getVisiblePackingImages = (images: T[] = []) => images.slice(0, DEFAULT_VISIBLE_COUNT)
  const getHiddenPackingImageCount = (images: T[] = []) => Math.max(images.length - DEFAULT_VISIBLE_COUNT, 0)
  const showPackingImageInfoDialog = (images: T[] = []) => {
    packingImageInfoList.value = images.map(getImageUrl).filter(Boolean)
    packingImageInfoVisible.value = true
  }

  return {
    getVisiblePackingImages,
    getHiddenPackingImageCount,
    packingImageInfoVisible,
    packingImageInfoList,
    showPackingImageInfoDialog,
  }
}

import { ref } from 'vue'

/**
 * 把 amazon 缩略图 URL 转成原图
 * 例如 https://m.media-amazon.com/images/I/71uZi8MxJiL._SL75_.jpg → 去掉 _SL75_
 */
export const toOriginalImage = (url: string): string => url.replace('_SL75_', '')

export const useImagePreview = () => {
  const imagePreviewVisible = ref(false)
  const imagePreviewList = ref<string[]>([])

  const openImagePreview = (url: string | string[] | null | undefined) => {
    if (!url) return
    const list = (Array.isArray(url) ? url : [url]).filter(Boolean)
    if (!list.length) return
    imagePreviewList.value = list
    imagePreviewVisible.value = true
  }

  const closeImagePreview = () => {
    imagePreviewVisible.value = false
    imagePreviewList.value = []
  }

  return {
    imagePreviewVisible,
    imagePreviewList,
    openImagePreview,
    closeImagePreview,
    toOriginalImage,
  }
}

import { gp } from '/@vab/plugins/vab'

const clipboardSuccess = (text: any) => {
  gp.$baseMessage(`拷贝 ${text} 成功`, 'success', 'hey')
}

const clipboardError = (text: any) => {
  gp.$baseMessage(`拷贝 ${text} 失败`, 'error', 'hey')
}

/**
 * @description 复制数据
 * @param text
 */
const handleClipboard = (event: Event, text: string) => {
  const { isSupported, copy } = useClipboard({ legacy: true })
  if (!isSupported) usePermission('clipboard-write')

  const target = event.target as HTMLElement
  const skuElement = target.closest('.copySku') as HTMLElement
  if (!skuElement) return

  copy(text)
    .then(() => {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(skuElement)
      selection?.removeAllRanges()
      selection?.addRange(range)
      clipboardSuccess(text)
    })
    .catch(() => {
      clipboardError(text)
    })
}

/**
 * 只复制
 * @param text
 */
export const handleClip = (text: string) => {
  const { isSupported, copy } = useClipboard({ legacy: true })
  if (!isSupported) usePermission('clipboard-write')

  return copy(text)
    .then(() => {
      clipboardSuccess(text)
      return true
    })
    .catch(() => {
      clipboardError(text)
      return false
    })
}
export default handleClipboard

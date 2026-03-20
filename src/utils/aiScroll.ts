export const aiScrollToBottom = (element?: HTMLElement | null) => {
  if (!element) return
  requestAnimationFrame(() => {
    element.scrollTop = element.scrollHeight
  })
}

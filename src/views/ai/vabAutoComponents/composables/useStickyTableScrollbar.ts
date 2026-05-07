// 给 Markdown 表格挂上一个跟随视口的浮动横向滚动条：当表格高度大于消息列表视口、
// 物理底部不可见时，sticky 条始终停在视口可见区域底部，方便用户随时拖动查看右侧列。

export function enhanceStickyTableScrollbars(root: HTMLElement): () => void {
  const cleanups: Array<() => void> = []
  const outers = root.querySelectorAll<HTMLElement>('.markdown-table-outer:not([data-sticky-bound])')

  outers.forEach((outer) => {
    const wrap = outer.querySelector<HTMLElement>('.markdown-table-wrap')
    const sticky = outer.querySelector<HTMLElement>('.markdown-table-sticky-scrollbar')
    const spacer = outer.querySelector<HTMLElement>('.markdown-table-sticky-spacer')
    const table = wrap?.querySelector<HTMLElement>('table')
    if (!wrap || !sticky || !spacer || !table) return

    outer.dataset.stickyBound = 'true'

    let syncing = false
    const onWrapScroll = () => {
      if (syncing) return
      syncing = true
      sticky.scrollLeft = wrap.scrollLeft
      requestAnimationFrame(() => {
        syncing = false
      })
    }
    const onStickyScroll = () => {
      if (syncing) return
      syncing = true
      wrap.scrollLeft = sticky.scrollLeft
      requestAnimationFrame(() => {
        syncing = false
      })
    }
    wrap.addEventListener('scroll', onWrapScroll, { passive: true })
    sticky.addEventListener('scroll', onStickyScroll, { passive: true })

    const updateLayout = () => {
      const tableWidth = table.scrollWidth
      spacer.style.width = `${tableWidth}px`
      const overflows = wrap.scrollWidth - wrap.clientWidth > 1
      sticky.classList.toggle('is-hidden', !overflows)
    }
    updateLayout()

    const ro = new ResizeObserver(updateLayout)
    ro.observe(wrap)
    ro.observe(table)

    cleanups.push(() => {
      wrap.removeEventListener('scroll', onWrapScroll)
      sticky.removeEventListener('scroll', onStickyScroll)
      ro.disconnect()
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

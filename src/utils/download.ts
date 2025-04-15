export function useDownloader(url: string, fileName: string) {
  const downloadFile = (url: string, filename: any) => {
    // 创建隐藏的可下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = filename || url.split('/').pop()

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { downloadFile }
}

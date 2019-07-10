export function download(data) {
  const blob = new Blob(
    [data], { type: 'application/octet-stream' })
  const aEle = document.createElement('a') // 创建a标签
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  aEle.href = href
  aEle.download = 'bill.xlsx'// 下载后文件名
  document.body.appendChild(aEle)
  aEle.click() // 点击下载
  document.body.removeChild(aEle) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

export default function downloadFile(data, fileName) {
  const downloadHandle = document.createElement('a')
  const fileContents = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data)
  downloadHandle.href = fileContents
  downloadHandle.download = fileName
  downloadHandle.click()
  // downloadHandle.remove()
}

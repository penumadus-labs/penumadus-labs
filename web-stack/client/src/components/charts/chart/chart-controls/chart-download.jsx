import React from 'react'

export default ({
  domain: [startTime, endTime],
  useDownload,
  downloadProps,
}) => {
  const [status, request] = useDownload()

  const handleClick = async () => {
    try {
      const data = await request(...downloadProps)
      const file = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data)

      const downloadHandle = document.createElement('a')
      downloadHandle.href = file
      downloadHandle.download = `${startTime} - ${endTime}.csv`
      downloadHandle.click()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <p>{startTime}</p>
      <p>{endTime}</p>
      {status}
      <button className="button" onClick={handleClick}>
        download
      </button>
    </>
  )
}

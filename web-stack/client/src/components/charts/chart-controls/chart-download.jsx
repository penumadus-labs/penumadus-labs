import React from 'react'
import { parseDomain } from '../helpers/datetime'

export default ({ getDomain, useDownload }) => {
  const domain = getDomain()
  const [start, end] = domain

  const [status, request] = useDownload()

  const [startTime, endTime] = parseDomain(domain)

  const handleClick = async () => {
    try {
      const data = await request(start, end)
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

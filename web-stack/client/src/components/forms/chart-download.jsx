import React from 'react'
import Status, { useStatus } from '../forms/status'
import { parseDomain } from '../../utils/datetime'
import useDatabase from '../../context/database/context'

export default ({ getDomain }) => {
  const domain = getDomain()
  const [start, end] = domain

  const [startTime, endTime] = parseDomain(domain)
  const [, { getStandardCSV }] = useDatabase()
  const [{ setLoading, setError, setSuccess }, status] = useStatus()

  const handleClick = async () => {
    try {
      setLoading()
      const data = await getStandardCSV({ start, end })
      setSuccess()
      const file = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data)

      const download = document.createElement('a')
      download.href = file
      download.download = `unit_3 ${startTime} - ${endTime}.csv`
      download.click()
    } catch (error) {
      setError()
    }
  }
  return (
    <>
      <p>{startTime}</p>
      <p>{endTime}</p>
      <Status {...status} />
      <button className="button" onClick={handleClick}>
        download
      </button>
    </>
  )
}

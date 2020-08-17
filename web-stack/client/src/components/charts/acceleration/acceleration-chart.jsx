import React from 'react'
import Chart from '../chart/chart'
import { formatHoursMinutes, parseDate } from '../datetime'

export default ({
  events: [, events],
  data: [status, result],
  // getData,
  useGetData,
  useDownload,
}) => {
  if (status) return status
  if (!result) return null

  const [dataStatus, getData, { loading }] = useGetData()

  const handleChange = ({ target }) => {
    const time = target.value
    getData({ time }).catch(console.error)
  }

  return (
    <Chart {...{ ...result, useDownload }}>
      {loading ? (
        dataStatus
      ) : (
        <select onChange={handleChange}>
          {events.map((time, i) => (
            <option key={i} value={time}>
              {parseDate(time)} - {formatHoursMinutes(time)}
            </option>
          ))}
        </select>
      )}
    </Chart>
  )
}

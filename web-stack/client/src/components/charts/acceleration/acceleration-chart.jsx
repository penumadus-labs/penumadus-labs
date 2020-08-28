import React from 'react'
import Chart from '../chart/chart'
import { formatHoursMinutes, parseDate } from '../datetime'

let timeout

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

  const get = (time) => getData({ time }).catch(console.error)

  const handleChange = ({ target }) => get(target.value)

  const liveModeSet = () => get(events.slice(-1)[0])

  const liveModeData = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    // start new array if timeout has finished
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
    }, 1000)
  }

  return (
    <Chart {...{ ...result, useDownload, liveModeSet, liveModeData }}>
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

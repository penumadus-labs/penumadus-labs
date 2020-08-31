import React, { useState, useEffect } from 'react'
import Chart from '../chart/chart'
import { formatHoursMinutes, parseDate } from '../datetime'

let timeout
let indexCache = 0

export default ({ events: [, events], useGetData, useDownload }) => {
  const [dataStatus, getData, { loading }] = useGetData()
  const [event, setEvent] = useState()

  const getEvent = async (index = indexCache) => {
    try {
      const event = await getData({ index })
      indexCache = index
      setEvent(event)
      return event
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getEvent()
    // eslint-disable-next-line
  }, [])

  const handleChange = ({ target }) => {
    getEvent(target.value)
  }

  const liveModeSet = () => getEvent(0)

  const liveModeAction = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    // start new array if timeout is not set
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    // debouce timeout until all data packets are recieved
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      getEvent(0)
      timeout = null
    }, 200)
  }

  if (!event) return dataStatus

  return (
    <Chart
      {...{ ...event, useDownload, liveModeSet, liveModeAction }}
      yDomain={[-10, 10]}
    >
      {(live) => {
        if (live) return null
        return (
          <select
            onChange={handleChange}
            disabled={loading}
            defaultValue={indexCache}
          >
            {events.map((time, i) => (
              <option key={i} value={i}>
                {parseDate(time)} - {formatHoursMinutes(time)}
              </option>
            ))}
          </select>
        )
      }}
    </Chart>
  )
}

import React, { useEffect, useState } from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'

let timeout
let indexCache = 0
let eventCache

export default ({ events: [eventsStatus, events], useGetData, ...props }) => {
  const [, getData, { loading }] = useGetData()
  const [event, setEvent] = useState(eventCache)

  const getEvent = async (index = indexCache) => {
    try {
      eventCache = await getData({ index })
      indexCache = index
      setEvent(eventCache)
      return eventCache
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(
    () => void getEvent(),
    // eslint-disable-next-line
    [events]
  )

  const initializeLive = () => getEvent(0)

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    //* start new array if timeout is not set
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    //* debounce timeout until all data packets are received
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      getEvent(0)
      timeout = null
    }, 1000)
  }

  const handleChange = ({ target }) => {
    getEvent(target.value)
  }

  return (
    <Chart
      {...{
        ...event,
        ...props,
        initializeLive,
        handleLive,
        downloadProps: [indexCache],
      }}
      status={eventsStatus}
      yDomain={[-10, 10]}
      render={(live) => {
        if (live) return null
        return (
          <EventSelector
            disabled={loading}
            onChange={handleChange}
            defaultValue={indexCache}
            events={events}
          />
        )
      }}
    />
  )
}

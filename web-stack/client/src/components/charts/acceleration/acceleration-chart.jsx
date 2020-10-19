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

  useEffect(() => {
    getEvent()
    // eslint-disable-next-line
  }, [events])

  const handleChange = ({ target }) => {
    getEvent(target.value)
  }

  const liveModeSet = () => getEvent(0)

  const liveModeAction = ({ type, data, setLiveData }) => {
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

  return (
    <Chart
      {...{
        ...event,
        downloadProps: [indexCache],
        liveModeSet,
        liveModeAction,
        ...props,
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

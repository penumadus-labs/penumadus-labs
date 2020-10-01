import React, { useEffect, useState } from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'

let timeout
let indexCache = 0
let eventCache

export default ({ events: [eventsStatus, events], useGetData, ...props }) => {
  const [dataStatus, getData, { loading }] = useGetData()
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
    if (!eventCache) getEvent()
    // eslint-disable-next-line
  }, [])

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
    }, 200)
  }

  if (!event) return <div className="card">{dataStatus}</div>

  return (
    <Chart
      {...{
        ...event,
        downloadProps: [indexCache],
        liveModeSet,
        liveModeAction,
        ...props,
      }}
      yDomain={[-10, 10]}
      render={(live) => {
        if (live) return null
        if (!events) return eventsStatus
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

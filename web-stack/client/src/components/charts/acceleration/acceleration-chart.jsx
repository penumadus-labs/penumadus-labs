import React, { useMemo } from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'

let timeout

export default ({
  event: [eventStatus, event],
  events: [, events],
  getEvent,
  getEvents,
  useGetEvent,
  ...props
}) => {
  const index = useMemo(() => {
    if (!event?.data || !events) return null
    return events.indexOf(event.data[0].time)
  }, [event, events])

  const initializeLive = () => getEvent(0)

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    //* start new array if timeout is not set
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    //* debounce timeout until all data packets are received
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      getEvents()
      getEvent(0)
      timeout = null
    }, 1000)
  }

  return (
    <Chart
      {...{
        ...event,
        ...props,
        initializeLive,
        handleLive,
        downloadProps: [index],
      }}
      status={eventStatus}
      yDomain={[-10, 10]}
      render={(live) =>
        !live &&
        !!events && (
          <EventSelector {...{ events, useGetEvent }} defaultValue={index} />
        )
      }
    />
  )
}

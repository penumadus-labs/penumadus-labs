import React from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'
import useApi from '../../../api'

let timeout

export default () => {
  const [
    {
      accelerationEvents: [, events],
      accelerationEvent,
    },
    { getAccelerationEvents, getAccelerationEvent },
    {
      useGetAccelerationEvent,
      useDownloadAccelerationEvent,
      useDeleteAccelerationEvents,
    },
  ] = useApi()

  const event = accelerationEvent[1]
  const index =
    !event?.data || !events ? null : events.indexOf(event.data[0].time)

  const initializeLive = () => getAccelerationEvent(0)

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    //* start new array if timeout is not set
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    //* debounce timeout until all data packets are received
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      getAccelerationEvents()
      getAccelerationEvent(0)
      timeout = null
    }, 1000)
  }

  return (
    <Chart
      {...{
        downloadProps: [index],
        initializeLive,
        handleLive,
      }}
      data={accelerationEvent}
      useDownload={useDownloadAccelerationEvent}
      useDelete={useDeleteAccelerationEvents}
      yDomain={[-10, 10]}
      render={(live) =>
        !live &&
        !!events && (
          <EventSelector
            {...{ events, useGetAccelerationEvent }}
            defaultValue={index}
          />
        )
      }
    />
  )
}

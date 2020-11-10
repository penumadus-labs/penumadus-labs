import React from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'
import useApi from '../../../api'

let timeout

export default () => {
  const [
    {
      acceleration: [, eventList],
      accelerationEvent,
    },
    { getAcceleration, getAccelerationEvent },
    {
      useGetAccelerationEvent,
      useDownloadAccelerationEvent,
      useDeleteAcceleration,
    },
  ] = useApi()

  const [, event] = accelerationEvent
  const index =
    !event?.data || !eventList ? null : eventList.indexOf(event.data[0].time)

  const initializeLive = () => getAccelerationEvent(0)

  const handleLive = ({ type, data, setLiveData }) => {
    if (type !== 'acceleration') return
    //* start new array if timeout is not set
    setLiveData((liveData) => (timeout ? liveData : []).concat([data]))

    //* debounce timeout until all data packets are received
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      getAcceleration()
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
      useDelete={useDeleteAcceleration}
      yDomain={[-10, 10]}
      render={(live) =>
        !live &&
        !!eventList && (
          <EventSelector
            {...{ eventList, useGetAccelerationEvent }}
            defaultValue={index}
          />
        )
      }
    />
  )
}

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
    !event?.data.length || !eventList
      ? null
      : eventList.indexOf(event.data[0].time)

  const initializeLive = () => getAccelerationEvent(0)

  const handleMutation = (data, store) => {
    const result = timeout ? [...store, data] : [data]
    clearTimeout(timeout)
    timeout = setTimeout(getAcceleration, 1000)
    return result
  }

  return (
    <Chart
      {...{
        downloadProps: [index],
        initializeLive,
        handleMutation,
      }}
      dataLabel="accelerationEvent"
      data={accelerationEvent}
      getData={getAcceleration}
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

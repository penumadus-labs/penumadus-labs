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
    { getAcceleration },
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

  const handleMutation = (data, store) => {
    const result = timeout ? [...store, data] : [data]
    clearTimeout(timeout)
    timeout = setTimeout(getAcceleration, 500)
    return result
  }

  return (
    <Chart
      {...{
        downloadProps: [index],
        handleMutation,
      }}
      dataType="accelerationEvent"
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

import React from 'react'
import Chart from '../chart/chart'
import EventSelector from './event-selector'
import useApi from '../../../api'

let timeout

export default function AccelerationChart() {
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

  const time = !event?.data.length || !eventList ? null : event.data[0].time

  const handleMutation = (data, store) => {
    const result = timeout ? [...store, data] : [data]
    clearTimeout(timeout)
    timeout = setTimeout(getAcceleration, 500)
    return result
  }

  return (
    <Chart
      {...{
        downloadProps: [time],
        handleMutation,
      }}
      dataType="accelerationEvent"
      data={accelerationEvent}
      getData={getAcceleration}
      useDownload={useDownloadAccelerationEvent}
      useDelete={useDeleteAcceleration}
      // yDomain={[-10, 10]}
      render={({ live }) =>
        !live &&
        !!eventList && (
          <EventSelector
            {...{ eventList, useGetAccelerationEvent }}
            defaultValue={eventList.indexOf(time)}
          />
        )
      }
    />
  )
}

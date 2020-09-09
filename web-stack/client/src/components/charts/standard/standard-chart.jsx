import React from 'react'
import Chart from '../chart/chart'
import { oneDayAgo } from '../datetime'
import Settings, { useSettings } from './settings'

export default ({
  state: [status, result],
  useDownload,
  useGetData,
  getData,
}) => {
  if (status) return <div className="card">{status}</div>
  if (!result) return null

  const [bind, OpenSettings] = useSettings()

  const liveModeSet = () => {
    return getData({ start: oneDayAgo() }, true).catch(console.error)
  }

  const liveModeAction = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [...liveData.slice(1), data])
  }

  return (
    <>
      <Chart
        {...result}
        {...{ useDownload, liveModeAction, liveModeSet }}
        yDomain={[-1, 100]}
      >
        {() => <OpenSettings />}
      </Chart>
      <Settings {...{ useGetData, ...bind }} />
    </>
  )
}

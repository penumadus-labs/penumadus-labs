import React from 'react'
import Chart from '../chart/chart'
import Settings, { useSettings } from './settings'
import { getADayAgo } from '../datetime'

export default ({
  state: [status, result],
  intervalDeps,
  useDownload,
  useGetData,
  getData,
}) => {
  if (status) return status
  if (!result) return null

  const [bind, OpenSettings] = useSettings()

  const liveModeSet = () => {
    return getData({ start: getADayAgo() }, true).catch(console.error)
  }

  const liveModeAction = ({ type, data, setLiveData }) => {
    if (type !== 'standard') return
    setLiveData((liveData) => [...liveData.slice(1), data])
  }

  return (
    <>
      <Chart {...result} {...{ useDownload, liveModeAction, liveModeSet }}>
        <OpenSettings />
      </Chart>
      <Settings {...{ useGetData, ...bind }} />
    </>
  )
}

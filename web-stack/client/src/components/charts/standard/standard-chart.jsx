import React from 'react'
import Chart from '../chart/chart'
import Settings, { useSettings } from './settings'

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

  const liveModeAction = () => getData({}, true).catch(console.error)

  return (
    <>
      <Chart {...result} {...{ liveModeAction, useDownload }}>
        <OpenSettings />
      </Chart>
      <Settings {...{ useGetData, ...bind }} />
    </>
  )
}

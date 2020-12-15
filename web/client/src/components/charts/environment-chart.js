import React from 'react'
import LinearDataChart from './linear-data/chart'
import BridgeSensorInfo from './bridge-sensor-info'
import useApi from '../../api'

export default () => {
  const [
    {
      device: { deviceType },
      environment,
    },
    { getEnvironment },
    { useGetEnvironment, useDownloadEnvironment, useDeleteEnvironment },
  ] = useApi()

  return (
    <LinearDataChart
      dataType="environment"
      data={environment}
      getData={getEnvironment}
      useGetData={useGetEnvironment}
      useDownload={useDownloadEnvironment}
      useDelete={useDeleteEnvironment}
    >
      {deviceType === 'bridge' ? <BridgeSensorInfo /> : null}
    </LinearDataChart>
  )
}

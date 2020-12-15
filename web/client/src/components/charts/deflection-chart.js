import React from 'react'
import LinearDataChart from './linear-data/chart'
import useApi from '../../api'

export default () => {
  const [
    { deflection },
    { getDeflection },
    { useGetDeflection, useDownloadDeflection, useDeleteDeflection },
  ] = useApi()

  debugger

  debugger
  return (
    <LinearDataChart
      dataType="deflection"
      data={deflection}
      getData={getDeflection}
      useGetData={useGetDeflection}
      useDownload={useDownloadDeflection}
      useDelete={useDeleteDeflection}
      yDomain={[5, 50]}
    />
  )
}

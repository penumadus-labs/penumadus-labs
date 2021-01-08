import React from 'react'
import LinearDataChart from './linear-data/chart'
import useApi from '../../api'

export default function DeflectionChart() {
  const [
    { deflection },
    { getDeflection },
    { useGetDeflection, useDownloadDeflection, useDeleteDeflection },
  ] = useApi()

  return (
    <LinearDataChart
      dataType="deflection"
      data={deflection}
      getData={getDeflection}
      useGetData={useGetDeflection}
      useDownload={useDownloadDeflection}
      useDelete={useDeleteDeflection}
      // yDomain={[5, 50]}
    />
  )
}

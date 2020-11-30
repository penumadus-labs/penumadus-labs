import React from 'react'
import LinearDataChart from './linear-data/chart'
import useApi from '../../api'

export default () => {
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
      useDownloadData={useDownloadDeflection}
      useDeleteData={useDeleteDeflection}
      yDomain={[13.3, 13.6]}
    />
  )
}

import React from 'react'
import LinearDataChart from './linear-data/chart'
import useApi from '../../api'

export default () => {
  const [
    { environment },
    { getEnvironment },
    { useGetEnvironment, useDownloadEnvironment, useDeleteEnvironment },
  ] = useApi()

  return (
    <LinearDataChart
      dataType="environemnt"
      data={environment}
      getData={getEnvironment}
      useGetData={useGetEnvironment}
      useDownloadData={useDownloadEnvironment}
      useDeleteData={useDeleteEnvironment}
    />
  )
}

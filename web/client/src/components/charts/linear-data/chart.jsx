import React from 'react'
import Chart from '../chart/chart'
import DomainSelector from './domain-selector'
import { resolution } from '../../../utils/live-data-config'

export default ({
  // dataType,
  // data,
  // useDownloadData,
  // useDeleteData,
  // yDomain = [-1, 100],
  getData,
  useGetData,
  ...props
}) => {
  const initializeLive = () => {
    return getData({ recent: true }, true)
  }

  const handleMutation = (data, store) => [
    ...store.slice(+(store.length >= resolution)),
    data,
  ]

  return (
    <Chart
      yDomain={[-1, 100]}
      {...{ initializeLive, handleMutation, getData }}
      {...props}
      // data={data}
      // getData={getData}
      // useDownload={useDownloadData}
      // useDelete={useDeleteData}
      // yDomain={yDomain}
      render={(live) => live || <DomainSelector useGetData={useGetData} />}
    />
  )
}

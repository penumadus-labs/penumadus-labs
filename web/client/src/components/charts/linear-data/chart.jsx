import React from 'react'
import Chart from '../chart/chart-x'
import DomainSelector from './domain-selector'
import useApi from '../../../api'
import { resolution } from '../../../utils/live-data-config'

export default ({
  dataLabel,
  data,
  getData,
  useGetData,
  useDownloadData,
  useDeleteData,
  yDomain = [-1, 100],
}) => {
  const initializeLive = () => {
    return getData({ recent: true }, true)
  }

  const handleMutation = (data, store) => [
    ...store.slice(+(store.length >= resolution)),
    data,
  ]

  return (
    <>
      <Chart
        {...{ initializeLive, handleMutation, dataLabel }}
        data={data}
        getData={getData}
        useDownload={useDownloadData}
        useDelete={useDeleteData}
        yDomain={yDomain}
        render={(live) => live || <DomainSelector useGetData={useGetData} />}
      ></Chart>
    </>
  )
}

import React from 'react'
import Chart from '../components/charts/linechart.jsx'
import useApi from '../context/api'

export default () => {
  const [
    { standardData },
    { getStandardData },
    { useGetStandardData, useDownloadStandardData },
  ] = useApi()

  return (
    <>
      <Chart
        state={standardData}
        getData={getStandardData}
        useDownload={useDownloadStandardData}
        useGetData={useGetStandardData}
      />
    </>
  )
}

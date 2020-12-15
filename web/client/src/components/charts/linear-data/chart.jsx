import React from 'react'
import Chart from '../chart/chart'
import DomainSelector from './domain-selector'

export default ({
  // dataType,
  // data,
  // useDownloadData,
  // useDeleteData,
  // yDomain = [-1, 100],
  getData,
  useGetData,
  children,
  render,
  ...props
}) => {
  const initializeLive = () => {
    return getData({ recent: true }, true)
  }

  const handleMutation = (data, store) => [
    ...store.slice(+(store.length >= process.env.REACT_APP_DATA_LIMIT)),
    data,
  ]

  return (
    <Chart
      yDomain={[-1, 50]}
      {...{ initializeLive, handleMutation, getData }}
      {...props}
      // data={data}
      // getData={getData}
      // useDownload={useDownloadData}
      // useDelete={useDeleteData}
      // yDomain={yDomain}
      render={({ live, domain }) => (
        <>
          {!live ? (
            <DomainSelector domain={domain} useGetData={useGetData} />
          ) : null}
          {typeof render === 'function' ? render(live) : children}
        </>
      )}
    />
  )
}

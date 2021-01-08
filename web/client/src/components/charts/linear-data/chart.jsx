import React from 'react'
import Chart from '../chart/chart'
import DomainSelector from './domain-selector'
import { dataLimit } from '../../../utils/config'

export default function LinearDataChart({
  getData,
  useGetData,
  children,
  render,
  ...props
}) {
  const initializeLive = () => {
    return getData({ recent: true }, true)
  }

  const handleMutation = (data, store) => [
    ...store.slice(+(store.length >= dataLimit)),
    data,
  ]

  return (
    <Chart
      yDomain={[-1, 50]}
      {...{ initializeLive, handleMutation, getData }}
      {...props}
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

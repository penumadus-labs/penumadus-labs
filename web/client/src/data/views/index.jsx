// @ts-check
import styled from '@emotion/styled'
import { LegendOrdinal as Legend } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'
import React, { useMemo } from 'react'
import { Controls } from './controllers'

import useApi from '../../api'

import * as settingsImport from '../model/settings'

const StyledDiv = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
`

export default function ContainerChart({ label = 'environment' }) {
  const [
    {
      [label]: [status, result],
    },
    ,
    { useDownloadEnvironment, useDeleteEnvironment, useGetEnvironmentData },
  ] = useApi()

  const data = result?.data

  const scaleLegend = useMemo(() => {
    const settings = settingsImport[label]
    const domain = settings.map(({ key }) => key)
    const range = settings.map(({ stroke }) => stroke)
    return scaleOrdinal({ domain, range })
  }, [label])

  if (status) return status

  if (!data) return null

  const api = {
    useDownload: useDownloadEnvironment,
    useGet: useGetEnvironmentData,
    useDelete: useDeleteEnvironment,
  }

  return (
    <StyledDiv className="card height100">
      <Controls label={label} data={data} api={api} />
      <Legend
        className="center-child"
        direction="row"
        itemMargin="0 .5rem"
        scale={scaleLegend}
      />
    </StyledDiv>
  )
}

/* <XYChart
    width={800}
    height={800}
    xScale={{ type: 'time' }}
    yScale={{ type: 'linear' }}
  >
    <LineSeries
      data={data}
      dataKey="data 1"
      xAccessor={xAccessor}
      yAccessor={yAccessor}
    ></LineSeries>
  </XYChart> */

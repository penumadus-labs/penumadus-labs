// @ts-check
import styled from '@emotion/styled'
import { LegendOrdinal as Legend } from '@visx/legend'
import { ParentSize } from '@visx/responsive'
import { scaleOrdinal } from '@visx/scale'
import React, { useMemo } from 'react'
import useApi from '../api'
import { Chart } from './chart'
import * as settingsImport from './helpers/settings'

const StyledDiv = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  .legend {
    margin: 0 auto;

    /* center legend vertically */
    display: grid;
    align-items: center;
  }
`

export default function ContainerChart({ label = 'environment' }) {
  const [
    {
      [label]: [status, result],
    },
  ] = useApi()

  const scaleLegend = useMemo(() => {
    const settings = settingsImport[label]
    const domain = settings.map(({ key }) => key)
    const range = settings.map(({ stroke }) => stroke)
    return scaleOrdinal({ domain, range })
  }, [label])

  if (status) return status

  if (!result?.data) return null

  return (
    <StyledDiv className="card height100">
      <ParentSize>
        {({ width, height }) => (
          <Chart
            width={width}
            height={height}
            label={label}
            data={result.data}
          />
        )}
      </ParentSize>
      <Legend
        className="legend"
        direction="row"
        itemMargin="0 .5rem"
        // never changes
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

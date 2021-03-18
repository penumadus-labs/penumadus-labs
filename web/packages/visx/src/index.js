// brush
// extent
// x scale
// y scale
// line

// @ts-check

import { LineSeries, XYChart } from '@visx/xychart'
import { LinePath } from '@visx/shape'
import { AxisTop, AxisRight } from '@visx/axis'
import * as Scale from '@visx/scale'
import React, { useRef, useEffect } from 'react'
import { render } from 'react-dom'
import { extent } from 'd3'
import { appleStock as data } from '@visx/mock-data'
import { Group } from '@visx/group'

// range is width of display
// domain is extend of data

for (const d of data) {
  d.date = new Date(d.date)
}

const xAccessor = ({ date }) => date
const yAccessor = ({ close }) => close

const xScale = Scale.scaleTime({
  range: [0, 800],
  domain: extent(data, xAccessor),
})
const yScale = Scale.scaleLinear({
  range: [0, 800],
  domain: extent(data, yAccessor),
})

const Chart = () => {
  const ref = useRef()

  useEffect(() => {
    console.log(ref.current)
  }, [ref])

  return (
    <svg ref={ref} width="800" height="800">
      <Group>
        {/* <XYChart
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
        </XYChart> */}
        <LinePath
          stroke="red"
          strokeWidth={2}
          data={data}
          x={(d) => xScale(xAccessor(d)) ?? 0}
          y={(d) => yScale(yAccessor(d)) ?? 0}
        />
        <AxisTop top={800} scale={xScale} />
        <AxisRight scale={yScale} />
      </Group>
    </svg>
  )
}

render(<Chart />, document.querySelector('#root'))

import { AxisBottom, AxisLeft } from '@visx/axis'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { appleStock as data } from '@visx/mock-data'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed } from '@visx/shape'
import { extent, max } from 'd3'
import React from 'react'
import { render } from 'react-dom'

console.log(data)
const width = 750
const height = 400

const x = ({ date }) => new Date(date)
const y = ({ close }) => close

// Bounds
const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
}
const xMax = width - margin.left - margin.right
const yMax = height - margin.top - margin.bottom

const xScale = scaleTime({
  range: [0, xMax],
  domain: extent(data, x),
})
const yScale = scaleLinear({
  range: [yMax, 0],
  domain: [0, max(data, y)],
})

const Chart = () => (
  <div>
    <svg width={width} height={height}>
      <LinearGradient from="#fbc2eb" to="#a6c1ee" id="gradient" />

      <Group top={margin.top} left={margin.left}>
        <AreaClosed
          data={data}
          // xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
          fill={'url(#gradient)'}
          stroke={''}
        />

        <AxisLeft
          scale={yScale}
          top={0}
          left={0}
          label={'Close Price ($)'}
          stroke={'#1b1a1e'}
          tickTextFill={'#1b1a1e'}
        />

        <AxisBottom
          scale={xScale}
          top={yMax}
          label={'Years'}
          stroke={'#1b1a1e'}
          tickTextFill={'#1b1a1e'}
        />
      </Group>
    </svg>
  </div>
)

render(<Chart />, document.querySelector('#root'))

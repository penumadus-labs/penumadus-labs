import React from 'react'
import { Chart, ScatterChart, Scatter } from './chart'
// import * as colors from '../../utils/colors'

export default ({ data }) => {
  for (const point of data) {
    const date = new Date(point.time * 1000)
    point.time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
  return (
    <Chart Chart={ScatterChart} data={data}>
      <Scatter
        dataKey="y"
        data={data}
        stroke="white"
        shape={({ x, y }) => {
          return (
            <line x1={x + 5} y1={y} x2={x + 5} y2={y + 10} stroke="white" />
          )
        }}
      />
    </Chart>
  )
}

import React from 'react'
import { Chart, Line } from './chart'
import * as colors from '../../utils/colors'

export default ({ data, options }) => {
  for (const point of data) {
    const date = new Date(point.time * 1000)
    point.time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
  return (
    <Chart data={data}>
      <Line
        dot={false}
        type="monotone"
        dataKey="temperature"
        stroke={colors.red}
      />
      <Line
        dot={false}
        type="monotone"
        dataKey="humidity"
        stroke={colors.blue}
      />
      <Line
        dot={false}
        type="monotone"
        dataKey="pressure"
        stroke={colors.violet}
      />
    </Chart>
  )
}

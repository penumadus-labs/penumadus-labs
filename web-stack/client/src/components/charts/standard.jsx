import React from 'react'
import { Chart, Line } from './line-chart'
import * as colors from '../../utils/colors'

export default ({ data, options }) => {
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

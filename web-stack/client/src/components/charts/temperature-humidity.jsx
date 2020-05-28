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
        stroke={colors.redPurple}
      />
      <Line
        dot={false}
        type="monotone"
        dataKey="humidity"
        stroke={colors.blue2}
      />
    </Chart>
  )
}

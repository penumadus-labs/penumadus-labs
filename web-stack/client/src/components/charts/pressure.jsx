import React from 'react'
import { Chart, Line } from './chart'
import * as colors from '../../utils/colors'

export default ({ data }) => {
  return (
    <Chart data={data}>
      <Line
        dot={false}
        type="monotone"
        dataKey="pressure"
        stroke={colors.violet}
      />
    </Chart>
  )
}

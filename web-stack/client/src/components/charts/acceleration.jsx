import React from 'react'
import { Chart, Line } from './line-chart'
import replace from '../../utils/replace-deprecated-recharts-method'
import * as colors from '../../utils/colors'

export default ({ data }) => {
  return (
    <Chart data={data}>
      <Line dot={false} type="monotone" dataKey="x" stroke={colors.raspberry} />
      <Line dot={false} type="monotone" dataKey="y" stroke={colors.jade} />
      <Line dot={false} type="monotone" dataKey="z" stroke={colors.steel} />
    </Chart>
  )
}

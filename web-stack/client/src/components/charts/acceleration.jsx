import React from 'react'
import { Chart, Line } from './line-chart'
import * as colors from '../../utils/colors'

export default ({ data }) => {
  return (
    <Chart data={data}>
      <Line dot={false} type="monotone" dataKey="x" stroke={colors.red} />
      <Line dot={false} type="monotone" dataKey="y" stroke={colors.yellow} />
      <Line dot={false} type="monotone" dataKey="z" stroke={colors.blue} />
      <Line
        dot={false}
        type="monotone"
        dataKey="magnitude"
        stroke={colors.green}
      />
    </Chart>
  )
}

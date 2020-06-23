import React from 'react'
import { Chart, Line } from './chart'
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

/* <Line
dot={false}
type="monotone"
data={data.temperature}
dataKey="y"
stroke={colors.violet}
/>
<Line
dot={false}
type="monotone"
data={data}
dataKey="temperature"
stroke={colors.violet}
/>
<Line
dot={false}
type="monotone"
data={data}
dataKey="y"
stroke={colors.violet}
/> */

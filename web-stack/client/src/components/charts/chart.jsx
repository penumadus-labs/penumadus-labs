import React, { memo, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from 'recharts'
import replace from '../../utils/replace-deprecated-recharts-method'
import * as colors from '../../utils/colors'

const tooltipContentStyle = {
  background: colors.card,
}

export const Chart = memo(({ children, data, Chart = LineChart }) => {
  useEffect(() => {
    setImmediate(() => {
      document.querySelectorAll('tspan').forEach(
        (elm) => {
          elm.setAttribute('fill', colors.font)
        },
        [data]
      )
    })
  })

  return (
    <div className="card-spaced chart">
      <ResponsiveContainer width="100%" height={600}>
        <Chart
          data={data}
          margin={{ left: -30, right: 10, bottom: 20, top: 10 }}
        >
          <Label value="hi" position="top" />
          <Legend verticalAlign="top" />
          <XAxis dataKey="time">
            <Label position="bottom">Time</Label>
          </XAxis>

          <YAxis />

          {children}
          <Tooltip contentStyle={tooltipContentStyle} />
        </Chart>
      </ResponsiveContainer>
    </div>
  )
})

replace(LineChart, Line, ScatterChart, Scatter)

export { LineChart, Line, ScatterChart, Scatter }

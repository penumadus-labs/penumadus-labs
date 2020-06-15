import React, { memo, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from 'recharts'
import replace from '../../utils/replace-deprecated-recharts-method'
import * as colors from '../../utils/colors'

replace(LineChart, Line)

const tooltipContentStyle = {
  background: colors.card,
}

export const Chart = memo(({ children, data }) => {
  console.log('render')
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
        <LineChart
          data={data}
          margin={{ left: -30, right: 10, bottom: 20, top: 10 }}
          onClick={(e) => console.log(e)}
        >
          <Label value="hi" position="top" />
          <Legend verticalAlign="top" />
          <XAxis dataKey="time">
            <Label>hello</Label>
          </XAxis>

          <YAxis />

          {children}
          <Tooltip contentStyle={tooltipContentStyle} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

export { Line }

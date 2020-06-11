import React, { memo } from 'react'
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
  return (
    <div className="card-spaced">
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          data={data}
          margin={{ left: -30, right: 10, bottom: 20, top: 10 }}
          onClick={(e) => console.log(e)}
        >
          <Label value="hi" position="top" />
          <Legend verticalAlign="top" />
          <XAxis dataKey="time">
            <Label
              content={({ viewBox: { x, y, width, height } }) => (
                <text x={width / 2} y={y + height + 10} fill={colors.font}>
                  Time (s)
                </text>
              )}
            ></Label>
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

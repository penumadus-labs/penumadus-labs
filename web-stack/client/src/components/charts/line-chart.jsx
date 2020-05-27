import React, { memo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianAxis,
  XAxis,
  YAxis,
  // Tooltip,
  Legend,
} from 'recharts'
import replace from '../../utils/replace-deprecated-recharts-method'

replace(LineChart, Line)

export const Chart = memo(({ children, data }) => {
  return (
    <div className="card-spaced">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ left: -30, right: 10 }}>
          <CartesianAxis />
          <XAxis />
          <YAxis />
          {/* <Tooltip /> */}
          <Legend />
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

export { Line }

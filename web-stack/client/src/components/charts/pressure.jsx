import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianAxis,
  XAxis,
  YAxis,
  // Tooltip,
  Legend,
  Line,
} from 'recharts'
// import replace from '../../utils/replace-deprecated-recharts-method'

// replace(LineChart, Line)

export default ({ data }) => {
  return (
    <div className='card'>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data} margin={{ left: -30, right: 10 }}>
          <CartesianAxis />
          <XAxis />
          <YAxis />
          {/* <Tooltip /> */}
          <Legend />
          <Line dot={false} type='monotone' dataKey='pressure' stroke='blue' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

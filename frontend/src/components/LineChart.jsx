import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts'
import Card from './Card.jsx'
import replace from '../utils/replace-deprecated-methods'

// replaces deprecated method to suppress error warning
replace(LineChart, Line)

export default ({ data, dataKey }) => {
  return (
    <Card>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data} margin={{ left: -30, right: 10 }}>
          <CartesianAxis />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dot={false} type='monotone' dataKey={dataKey} stroke='yellow' />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

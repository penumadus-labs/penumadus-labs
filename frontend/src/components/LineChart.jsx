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
import useResize from '../hooks/use-resize'
import replaceMethods from '../utils/replace-methods'

// deprecated shit :(
replaceMethods([LineChart, Line])

export default ({ data, dataKey }) => {
  useResize()

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

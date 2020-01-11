import React from 'react'
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts'
import replaceMethods from '../utils/replace-methods'

// deprecated shit :(
replaceMethods([LineChart, Line])

const LineGraph = ({ data, dataKey }) => {
  return (
    <LineChart
      width={1200}
      height={250}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line dot={false} type='monotone' dataKey={dataKey} stroke='#8884d8' />
    </LineChart>
  )
}

export default LineGraph

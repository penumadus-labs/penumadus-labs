import React from 'react'
import styled from 'styled-components'
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

const Root = styled(LineChart)`
  margin: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.color.navBackground};
`

export default ({ data, dataKey }) => {
  return (
    <Root
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
    </Root>
  )
}

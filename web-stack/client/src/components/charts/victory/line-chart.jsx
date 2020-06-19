import React from 'react'
import {
  VictoryChart as Chart,
  VictoryLine as Line,
  VictoryTheme as theme,
  createContainer,
  VictoryVoronoiContainer,
} from 'victory'

// const data = [
//   { x: 1, y: 2 },
//   { x: 2, y: 3 },
//   { x: 3, y: 5 },
//   { x: 4, y: 4 },
//   { x: 5, y: 7 },
// ]

const Container = createContainer('voronoi', 'zoom')
const data = [...Array(100).keys()].map((x) => ({
  x,
  y: 100 + x + Math.floor(Math.random() * 10),
}))

console.log(data)

export default () => {
  const container = (
    <Container
      labels={({ datum }) =>
        `${Math.round(datum.x, 2)}, ${Math.round(datum.y, 2)}`
      }
    />
  )
  return (
    <div className="card">
      <Chart
        theme={theme.material}
        width="1200"
        height="600"
        containerComponent={container}
      >
        <Line data={data} />
      </Chart>
    </div>
  )
}

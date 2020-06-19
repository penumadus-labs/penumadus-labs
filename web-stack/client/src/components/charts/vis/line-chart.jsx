import React, { useState } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis, Highlight } from 'react-vis'

export default ({ data }) => {
  // const data1 = [
  //   { x: 1, y: 10 },
  //   { x: 2, y: 5 },
  //   { x: 0, y: 5 },
  //   { x: 3, y: 15 },
  //   { x: 4, y: 10 },
  //   { x: 5, y: 5 },
  //   { x: 6, y: 15 },
  //   { x: 7, y: 10 },
  //   { x: 8, y: 5 },
  //   { x: 9, y: 15 },
  //   { x: 10, y: 10 },
  // ]

  // const data2 = [
  //   { x: 1, y: 10 },
  //   { x: 2, y: 5 },
  //   { x: 3, y: 15 },
  //   { x: 4, y: 10 },
  //   { x: 5, y: 5 },
  //   { x: 7, y: 10 },
  //   { x: 8, y: 5 },
  //   { x: 0, y: 5 },
  //   { x: 6, y: 15 },
  //   { x: 9, y: 15 },
  //   { x: 10, y: 10 },
  // ]

  const [domain, setDomain] = useState(null)

  const reset = () => setDomain(null)

  return (
    <>
      <XYPlot
        animation
        width={300}
        height={300}
        xDomain={domain && [domain.left, domain.right]}
      >
        <LineSeries color="red" data={data} />
        <XAxis />
        <YAxis />
        <Highlight enableY={false} onBrushEnd={setDomain} />
      </XYPlot>
      <button className="button" onClick={reset}>
        Reset
      </button>
    </>
  )
}

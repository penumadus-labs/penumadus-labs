import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis'
import { scaleTime } from '@visx/scale'
import { LinePath } from '@visx/shape'
import { extent } from 'd3-array'
import { brushHeight, margin } from './size'
import { isDefined, accessTime } from './utils'
import { scaleLinear } from '@visx/scale'

const brushGroupTopOffset = margin.bottom + brushHeight
const chartHeightOffset =
  margin.top + margin.center + brushHeight + margin.bottom

export const resizeChart = (width, height, brushDomain) => {
  const innerWidth = width - margin.x
  const chartHeight = height - chartHeightOffset

  return {
    innerWidth,
    chartHeight,
  }
}

export const resizeBrush = (width, height, brushDomain) => {
  const innerWidth = width - margin.x
  const groupTop = height - brushGroupTopOffset

  const scaleBrush = scaleTime({
    range: [0, innerWidth],
    domain: brushDomain,
  })

  return { groupTop, scaleBrush, brushDomain }
}

export const changeView = (
  data,
  settings,
  { chartHeight, innerWidth },
  { extentLeft, extentRight }
) => {
  const xScale = scaleTime({
    range: [0, innerWidth],
    domain: extent(data.map(accessTime)),
  })

  const yRange = [chartHeight, 0]

  const scaleLeft = scaleLinear({
    range: yRange,
    domain: extentLeft,
  })

  const scaleRight = scaleLinear({
    range: yRange,
    domain: extentRight,
  })

  const lines = settings.map(({ stroke, accessor, axis }, i) => {
    const yScale = axis === 'left' ? scaleLeft : scaleRight
    return (
      <LinePath
        key={i}
        stroke={stroke}
        strokeWidth={2}
        data={data}
        x={(d) => xScale(accessTime(d))}
        y={(d) => yScale(accessor(d))}
        defined={isDefined}
      />
    )
  })

  return (
    <>
      {lines}
      <AxisBottom
        top={chartHeight}
        axisClassName="axis"
        label="time"
        scale={xScale}
      />
      <AxisLeft axisClassName="axis" label="temperature" scale={scaleLeft} />,
      <AxisRight
        axisClassName="axis"
        label="temp"
        scale={scaleRight}
        left={innerWidth}
      />
    </>
  )
}

export const filterData = (initialData, { x0, x1 }) =>
  initialData.filter(({ time }) => x0 < time && time < x1)

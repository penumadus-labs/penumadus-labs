import { scaleLinear } from '@visx/scale'

export const margin = {
  left: 80,
  right: 80,
  top: 20,
  bottom: 50,
  center: 80,
}

margin.x = margin.left + margin.right
margin.y = margin.top + margin.bottom

export const brushHeight = 100
// export const brushGroupHeight = brushHeight + margin.center

const brushRange = [brushHeight, 0]

export const yScaleBrush = scaleLinear({
  range: brushRange,
  domain: brushRange,
})

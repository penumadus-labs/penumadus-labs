import { extent } from 'd3-array'

export const isDefined = (d) => d !== -273 || !isNaN(d)

export const getDomainPadded = (data, accessor) => {
  const [min, max] = extent(data, accessor)
  const padding = (+max - +min) * 0.1
  return [+min - padding, +max + padding]
}

export const accessTime = ({ time }) => +time

export const getTimeDomain = (data) => extent(data.map(accessTime))

export const getAxisDomains = (data, setting) => {
  const extentsLeft = []
  const extentsRight = []
  for (const { axis, accessor } of setting) {
    const e = extent(data, accessor)
    if (axis === 'left') {
      extentsLeft.push(...e)
    } else {
      extentsRight.push(...e)
    }
  }

  return [extent(extentsLeft), extent(extentsRight)]
}

export const mapYScaleSettings = (left, right, settings) => {
  for (const s of settings) {
    s.yScale = s.axis === 'left' ? left : right
  }
}

import { extent } from 'd3-array'

export const isDefined = (d) => d !== -273 || !isNaN(d)

export const getExtentPadded = (data, accessor) => {
  const [min, max] = extent(data, accessor)
  const padding = (+max - +min) * 0.1
  return [+min - padding, +max + padding]
}

export const accessTime = ({ time }) => +time

export const getExtentTime = (data) => extent(data.map(accessTime))

export const getObjectExtent = (data, object) => {
  const extentsLeft = []
  const extentsRight = []
  for (const { axis, accessor } of object) {
    const e = extent(data, accessor)
    if (axis === 'left') {
      extentsLeft.push(...e)
    } else {
      extentsRight.push(...e)
    }
  }

  return {
    extentLeft: extent(extentsLeft),
    extentRight: extent(extentsRight),
  }
}

// function findPerpendicularDistance(point, line) {
//   var pointX = point[0],
//     pointY = point[1],
//     lineStart = {
//       x: line[0][0],
//       y: line[0][1],
//     },
//     lineEnd = {
//       x: line[1][0],
//       y: line[1][1],
//     },
//     slope = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x),
//     intercept = lineStart.y - slope * lineStart.x,
//     result
//   result =
//     Math.abs(slope * pointX - pointY + intercept) /
//     Math.sqrt(Math.pow(slope, 2) + 1)
//   return result
// }

// function douglasPeucker(points, epsilon) {
//   var i,
//     maxIndex = 0,
//     maxDistance = 0,
//     perpendicularDistance,
//     leftRecursiveResults,
//     rightRecursiveResults,
//     filteredPoints
//   // find the point with the maximum distance
//   for (i = 2; i < points.length - 1; i++) {
//     perpendicularDistance = findPerpendicularDistance(points[i], [
//       points[1],
//       points[points.length - 1],
//     ])
//     if (perpendicularDistance > maxDistance) {
//       maxIndex = i
//       maxDistance = perpendicularDistance
//     }
//   }
//   // if max distance is greater than epsilon, recursively simplify
//   if (maxDistance >= epsilon) {
//     leftRecursiveResults = douglasPeucker(points.slice(1, maxIndex), epsilon)
//     rightRecursiveResults = douglasPeucker(points.slice(maxIndex), epsilon)
//     filteredPoints = leftRecursiveResults.concat(rightRecursiveResults)
//   } else {
//     filteredPoints = points
//   }
//   return filteredPoints
// }

// module.exports = douglasPeucker

const filterStandard0 = (data) => {
  const test = (val, limit) => val < limit - range || limit + range < val

  const humdityLimit = 45
  const temperatureLimit = 30
  const pressureLimit = 0
  const range = 1

  return data.filter(({ humidity, temperature, pressure, time }) => {
    return (
      test(humidity, humdityLimit) ||
      test(temperature, temperatureLimit) ||
      test(pressure, pressureLimit)
    )
  }, [])
}

const filterAcceleration0 = (data) => {
  const test = (val) => val < limit - range || limit + range < val

  const xLimit = 6.5
  const yLimit = 6.2
  const zLimit = 6.7

  const limit = 6.3
  const range = 5

  return data.filter(({ x, y, z, time }) => {
    return test(x) || test(y) || test(z)
  }, [])
}

const filterAccelerationEvents0 = (data) => {
  let prev = { time: 0 }

  return data
    .filter((point) => {
      const res = point.time - 0.01 >= prev.time
      prev = point
      return res
    })
    .map((point) => ({ time: point.time, y: 0.5 }))
}

const filterStandard = (data) => {
  const standardRange = 0.5
  let latestH = -1
  let latestP = -1
  let latestT = -1

  const test = (val, limit) =>
    val < limit - standardRange || limit + standardRange <= val

  const last = data.pop()

  return data
    .filter((datum, i) => {
      let res = false
      let { humidity, pressure, temperature } = datum
      if (test(humidity, latestH)) {
        latestH = humidity
        res = true
      }
      if (test(pressure, latestP)) {
        latestP = pressure
        res = true
      }
      if (test(temperature, latestT)) {
        latestT = temperature
        res = true
      }
      return res
    })
    .concat(last)
}

const filterAcceleration = (data) => {
  const accelerationRange = 0.8
  let latestX = -1
  let latestY = -1
  let latestZ = -1
  let latestM = -1

  const test = (val, limit) =>
    val < limit - accelerationRange || limit + accelerationRange <= val

  const last = data.pop()

  return data
    .filter((datum, i) => {
      let res = false
      let { x, y, z, magnitude } = datum
      if (test(x, latestX)) {
        latestX = x
        res = true
      }
      if (test(y, latestY)) {
        latestY = y
        res = true
      }
      if (test(z, latestZ)) {
        latestZ = z
        res = true
      }
      if (test(magnitude, latestM)) {
        latestM = magnitude
        res = true
      }
      return res
    })
    .concat(last)
}

const filterData = (label, data, range = 0.9) => {
  const makePoint = (point) => ({
    time: point.time,
    y: point[label],
  })
  const test = (val) => val < currentVal - range || currentVal + range <= val

  let tmp = data.shift()
  let currentVal = tmp[label]

  const filtered = [makePoint(tmp)]

  for (let i = 0; i < data.length - 1; i++) {
    const current = data[i]
    const next = data[i + 1]
    if (test(next[label])) {
      currentVal = next[label]
      filtered.push(makePoint(current), makePoint(next))
      i++
    }
  }

  tmp = data.pop()

  return filtered.concat(makePoint(tmp))
}

module.exports = {
  filterStandard,
  filterAcceleration,
  filterData,
}

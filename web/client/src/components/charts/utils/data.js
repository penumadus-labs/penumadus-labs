export const formatData = (data) => {
  return data.map(({ sensors = [], count, fills, ...data }) => {
    sensors.forEach((value, i) => {
      data[`T${i + 1}`] = value
    })
    return data
  })
}

export const formatKeys = ([data = {}]) => Object.keys(data)

const excludedKeys = ['time']

const removeExcludedKeys = (keys) =>
  keys.filter((key) => !excludedKeys.includes(key))

export const getYDomain = ({ data, keys }) => {
  let min = Infinity
  let max = -Infinity
  for (const key of removeExcludedKeys(keys)) {
    const values = data.map((data) => data[key])
    max = Math.max(max, ...values)
    min = Math.min(min, ...values)
  }
  return [min - 5, max + 5]
}

export const formatLabels = (keys) => removeExcludedKeys(keys)

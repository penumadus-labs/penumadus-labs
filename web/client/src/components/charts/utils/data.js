export const formatData = (data) =>
  data.map(({ sensors = [], count, fills, ...data }) => {
    sensors.forEach((value, i) => {
      data[`T${i + 1}`] = value
    })
    return data
  })

export const formatKeys = (data) => Object.keys(data[0])

const excludedKeys = ['time']

export const formatLabels = (keys) =>
  keys.filter((key) => !excludedKeys.includes(key))

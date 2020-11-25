const { getDataKeys, getNoDataCollected } = require('./helpers')

const accelerationData = ({ index, deviceType }) => {
  const field = 'acceleration'
  const input = `$${field}`

  const data = {
    $cond: {
      if: { $eq: [{ $size: input }, 0] },
      then: [],
      else: { $arrayElemAt: [input, +index] },
    },
  }

  return {
    data,
    ...getNoDataCollected({ input }),
    ...getDataKeys({ field, deviceType }),
  }
}
module.exports = accelerationData

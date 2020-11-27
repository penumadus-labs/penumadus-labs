const { dataQuery } = require('./helpers')

const accelerationData = ({ index }) => {
  const field = 'acceleration'
  const input = `$${field}`

  return dataQuery(input, {
    $cond: {
      if: { $eq: [{ $size: input }, 0] },
      then: [],
      else: { $arrayElemAt: [input, +index] },
    },
  })
}
module.exports = accelerationData

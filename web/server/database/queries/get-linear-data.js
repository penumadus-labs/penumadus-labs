const getRecentLinearData = require('./get-recent-linear-data')
const getSlicedLinearData = require('./get-sliced-linear-data')
const { dataQuery } = require('./helpers')

module.exports = ({ field, recent, resolution, start, end, limit }) => {
  const input = `$${field}`

  return dataQuery(
    input,
    recent
      ? getRecentLinearData({ input, resolution })
      : getSlicedLinearData({ input, start, end, limit })
  )
}

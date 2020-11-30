const getLinearDataByValue = require('./get-linear-data-value-slice')
const getLinearDataByTime = require('./get-linear-data-time-slice')
const { dataQuery } = require('./helpers')

module.exports = ({ field, recent, start, end, limit }) => {
  const input = `$${field}`

  return dataQuery(
    input,
    recent
      ? getLinearDataByValue({ input, limit })
      : getLinearDataByTime({ input, start, end, limit })
  )
}

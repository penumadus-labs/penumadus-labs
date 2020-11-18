const getRecentLinearData = require('./get-recent-linear-data')
const getSlicedLinearData = require('./get-sliced-linear-data')
const { getNoDataCollected, getDataKeys } = require('./helpers')

module.exports = ({
  field,
  deviceType,
  recent,
  resolution,
  start,
  end,
  limit,
}) => {
  const input = `$${field}`

  // if download request
  if (limit === null) {
    return {
      data: getSlicedLinearData({ input, limit }),
    }
  }

  return {
    ...getNoDataCollected({ input }),
    ...getDataKeys({ deviceType, field }),
    data: recent
      ? getRecentLinearData({ input, resolution })
      : getSlicedLinearData({ input, start, end, limit }),
  }
}

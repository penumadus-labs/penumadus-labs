const getDataKeys = require('./get-data-keys')

const accelerationData = ({ index }) => {
  return {
    keys: getDataKeys({ $first: '$events' }),
    data: { $arrayElemAt: ['$events', +index] },
  }
}
module.exports = accelerationData

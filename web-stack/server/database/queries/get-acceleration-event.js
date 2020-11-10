const getDataKeys = require('./get-data-keys')

const accelerationData = ({ index }) => {
  return {
    keys: getDataKeys({ $first: '$acceleration' }),
    data: { $arrayElemAt: ['$acceleration', +index] },
  }
}
module.exports = accelerationData

const getDataKeys = require('./get-data-keys')

const accelerationData = ({ index }) => {
  return {
    keys: getDataKeys({ $first: '$accelerationEvents' }),
    data: { $arrayElemAt: ['$accelerationEvents', +index] },
  }
}
module.exports = accelerationData

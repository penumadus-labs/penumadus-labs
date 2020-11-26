const { getDataKeys } = require('../schemas')

const getObjectKeys = (obj) => {
  return {
    $map: {
      input: { $objectToArray: obj },
      in: '$$this.k',
    },
  }
}

// deprecated -- gets keys of first element of data
// const getDataKeys = (array) => {
//   const input = getDataKeys({ $first: array })

//   // filters out unwanted keys
//   return {
//     $filter: {
//       input,
//       cond: { $not: { $in: ['$$this', excludedKeys] } },
//     },
//   }
// }

const getNoDataCollected = ({ input }) => ({
  noDataCollected: { $eq: [{ $size: input }, 0] },
})

const checkIsArray = (data) => ({
  data: { $cond: { if: { $isArray: input }, then: data, else: undefined } },
})

module.exports = {
  getDataKeys,
  getNoDataCollected,
  checkIsArray,
}

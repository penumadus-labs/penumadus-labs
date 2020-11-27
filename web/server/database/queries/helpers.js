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

const dataQuery = (input, data) => ({
  ...getNoDataCollected({ input }),
  data,
})

module.exports = {
  dataQuery,
  checkIsArray,
}

const $let = ({ $in, ...vars }) => ({
  $let: {
    vars,
    in: $in,
  },
})

const $filter = (input, cond) => ({
  $filter: { input, cond },
})

const $between = (value, start, end) => ({
  $and: [{ $gte: [value, start] }, { $lte: [value, end] }],
})

const $isZero = (value, trueCase, falseCase) => ({
  $cond: [{ $eq: [value, 0] }, trueCase, falseCase],
})

const $roundedDivision = (a, b) => ({
  $round: {
    $divide: [a, b],
  },
})

const $size = (value) => ({ $size: value })

const $reduce = (input, expr, init) => ({
  $let: {
    vars: {
      reduced: {
        $reduce: {
          input,
          initialValue: { index: 0, result: init },
          in: {
            index: { $add: ['$$value.index', 1] },
            result: expr,
          },
        },
      },
    },
    in: '$$reduced.result',
  },
})

$reduce()

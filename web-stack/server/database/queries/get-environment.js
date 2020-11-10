const getDataKeys = require('./get-data-keys')

const reduceExpr = {
  $cond: [
    { $eq: [{ $mod: ['$$value.index', '$$step'] }, 0] },
    { $concatArrays: ['$$value.acc', ['$$this']] },
    '$$value.acc',
  ],
}

module.exports = ({ start, end, limit = 1000 }) => {
  //* filters the data by the selected time range
  const sliced = {
    $filter: {
      input: '$environment',
      cond: {
        $and: [
          { $gte: [`$$this.time`, start ? +start : -Infinity] },
          { $lte: [`$$this.time`, end ? +end : Infinity] },
        ],
      },
    },
  }

  if (limit <= 0) return { data: sliced }

  //* iterates through the data keeping track of the index
  //* skips over the dataset selecting every nth packet where n is equal to $$step reducing the data set down to the specified limit
  const reduce = {
    $let: {
      vars: {
        reduced: {
          $reduce: {
            input: '$environment',
            initialValue: { index: 0, acc: [] },
            in: {
              index: { $add: ['$$value.index', 1] },
              acc: reduceExpr,
            },
          },
        },
      },
      in: '$$reduced.acc',
    },
  }

  //* calculates $$step by dividing the length of the dataset by specified limit
  //* if $$step equals 0 aka the size of the slice of the dataset is zero
  //* return empty array to not divide by zero

  const data = {
    $let: {
      vars: {
        step: {
          $ceil: {
            $divide: [{ $size: sliced }, limit],
          },
        },
      },
      in: {
        $cond: [{ $eq: ['$$step', 0] }, [], reduce],
      },
    },
  }

  return {
    keys: getDataKeys('$environment'),
    data,
  }
}

//* when the index is divisible by step concatenate the data
//* else return the unmodified array
const reduceBody = {
  $cond: [
    { $eq: [{ $mod: ['$$value.index', '$$step'] }, 0] },
    { $concatArrays: ['$$value.acc', ['$$this']] },
    '$$value.acc',
  ],
}

module.exports = ({ input, start, end, limit = 1000 }) => {
  //* filters the data by the selected time range
  const sliced = {
    $filter: {
      input,
      cond: {
        $and: [
          { $gte: [`$$this.time`, start ? +start : -Infinity] },
          { $lte: [`$$this.time`, end ? +end : Infinity] },
        ],
      },
    },
  }

  // if no limit return the whole slice -- used for csv download
  if (limit === null) return { data: sliced }

  //* iterates through the data keeping track of the index
  //* skips over the dataset selecting every nth (sizeSlice / limit) packet
  // * the total wil be the roughly the size of the limit provided
  const reduce = {
    $let: {
      vars: {
        reduced: {
          $reduce: {
            input,
            initialValue: { index: 0, acc: [] },
            in: {
              index: { $add: ['$$value.index', 1] },
              acc: reduceBody,
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

  return {
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
}

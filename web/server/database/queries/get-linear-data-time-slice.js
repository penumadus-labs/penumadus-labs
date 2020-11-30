//* when the index is divisible by step concatenate the data
//* else return the unmodified array
const reduceBody = {
  $cond: [
    { $eq: [{ $mod: ['$$value.index', '$$step'] }, 0] },
    { $concatArrays: ['$$value.result', ['$$this']] },
    '$$value.result',
  ],
}

const old = ({ input, start, end, limit }) => {
  //* filters the data by the selected time range

  // const startTime = start ? +start : -Infinity
  // const endTime = end ? +end : Infinity

  const sliced = {
    $filter: {
      input,
      cond: {
        $and: [
          { $gte: ['$$this.time', start ? +start : -Infinity] },
          { $lte: ['$$this.time', end ? +end : Infinity] },
        ],
      },
    },
  }

  // if no limit return the whole slice -- used for csv download
  if (limit === null) return sliced

  //* iterates through the data keeping track of the index
  //* skips over the dataset selecting every nth (sizeSlice / limit) packet
  // * the total wil be the roughly the size of the limit provided
  const reduce = {
    $let: {
      vars: {
        reduced: {
          $reduce: {
            input: '$$sliced',
            initialValue: { index: 0, result: [] },
            in: {
              index: { $add: ['$$value.index', 1] },
              result: reduceBody,
            },
          },
        },
      },
      in: '$$reduced.result',
    },
  }

  //* calculates $$step by dividing the length of the dataset by specified limit
  //* if $$step equals 0 aka the size of the slice of the dataset is zero
  //* return empty array to not divide by zero

  const step = {
    $let: {
      vars: {
        step: {
          $round: {
            $divide: [{ $size: '$$sliced' }, limit],
          },
        },
      },

      in: {
        $cond: [{ $eq: ['$$step', 0] }, [], reduce],
      },
    },
  }

  return {
    $let: {
      vars: {
        sliced,
      },
      in: step,
    },
  }
}

module.exports = ({ input, start, end, limit }) => ({
  $function: {
    lang: 'js',
    args: [input, start ? +start : -Infinity, end ? +end : Infinity, +limit],
    body: function (input, start, end, limit) {
      const slice = input.filter(({ time }) => start < time && time < end)
      if (!limit) return slice
      const step = Math.ceil(slice.length / limit)
      return slice.filter((_, i) => i % step === 0)
    }.toString(),
  },
})

// cleaner?
// const step = $let({
//   step: {
//     $ceil: {
//       $divide: [{ $size: '$$sliced' }, limit],
//     },
//   },
//   $in: {
//     $cond: [{ $eq: ['$$step', 0] }, [], reduce],
//   },
// })

// return $let({
//   sliced,
//   $in: step,
// })

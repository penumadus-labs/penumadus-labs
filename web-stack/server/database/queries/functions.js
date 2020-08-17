const reduce = (input, expr) => ({
  $let: {
    vars: {
      reduced: {
        $reduce: {
          input,
          initialValue: { index: 0, acc: [] },
          in: {
            index: { $add: ['$$value.index', 1] },
            acc: expr,
          },
        },
      },
    },
    in: '$$reduced.acc',
  },
})

const excludedKeys = ['fills', 'time']

const getDataKeys = (field) => {
  const input = {
    $map: {
      input: { $objectToArray: { $first: `$${field}` } },
      in: '$$this.k',
    },
  }

  return {
    $filter: {
      input,
      cond: { $not: { $in: ['$$this', excludedKeys] } },
    },
  }
}

module.exports = { reduce, getDataKeys }

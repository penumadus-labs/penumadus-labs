const excludedKeys = ['fills', 'time']

// takes the first element of an array of objects, and returns the keys of that object

const getDataKeys = (array) => {
  const input = {
    $map: {
      input: { $objectToArray: { $first: array } },
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

module.exports = getDataKeys

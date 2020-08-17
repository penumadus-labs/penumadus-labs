const getList = (client) => async (field, id) => {
  const res = await client.devices
    .aggregate([
      { $match: { id } },
      {
        $project: {
          [`${field}.time`]: 0,
          [`${field}.fills`]: 0,
        },
      },
      {
        $project: {
          _id: 0,
          list: {
            $map: {
              input: { $objectToArray: { $first: `$${field}` } },
              in: '$$this.k',
            },
          },
        },
      },
    ])
    .toArray()

  return res[0].list
}

module.exports = getList

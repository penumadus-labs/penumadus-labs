//* get the time of the first packet of each event
const { getNoDataCollected } = require('./helpers')

module.exports = () => {
  const input = '$acceleration'
  return {
    ...getNoDataCollected({ input }),
    data: {
      $map: {
        input,
        in: {
          $let: {
            vars: { first: { $first: '$$this' } },
            in: '$$first.time',
          },
        },
      },
    },
  }
}

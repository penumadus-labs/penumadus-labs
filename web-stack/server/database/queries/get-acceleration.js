//* get the time of the first packet of each event

module.exports = () => {
  return {
    data: {
      $map: {
        input: '$acceleration',
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

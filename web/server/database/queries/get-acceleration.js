//* get the time of the first packet of each event

// gets time of first packet in event
module.exports = () => {
  const input = '$acceleration'
  return {
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

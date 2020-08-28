const { reduce } = require('./functions')

const field = 'accelerationData'

const eventSize = 100

const acclerationEvents = (client) => async ({ id }) => {
  const { data } = await client.devices.findOne(
    { id },
    {
      projection: {
        _id: 0,
        data: reduce(`$${field}`, {
          $cond: [
            { $eq: [{ $mod: ['$$value.index', eventSize] }, 0] },
            { $concatArrays: ['$$value.acc', ['$$this.time']] },
            '$$value.acc',
          ],
        }),
      },
    }
  )

  return data
}

module.exports = acclerationEvents

const data = {
  data: { $map: { input: 'accelerationEvents', in: '$$this.time' } },
}

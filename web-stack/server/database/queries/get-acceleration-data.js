const { getDataKeys } = require('./functions')

const field = 'accelerationData'

const eventSize = 100

const accelerationData = (client) => ({ id, time }) => {
  const map = {
    $map: {
      input: `$${field}`,
      in: '$$this.time',
    },
  }

  const index = { $indexOfArray: [map, +time] }

  return client.devices.findOne(
    { id },
    {
      projection: {
        _id: 0,
        keys: getDataKeys(field),
        data: {
          $slice: [`$${field}`, index, 100],
        },
        map,
        index,
      },
    }
  )
}

module.exports = accelerationData

const accelerationDataNew = (client) => ({ id, time }) => {
  return client.devices.aggregate([
    { $match: { id } },
    { $unwind: 'accelerationEvents' },
    { $match: 'accelerationEvents.time' },
  ])
}

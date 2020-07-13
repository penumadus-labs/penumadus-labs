const client = require('../controllers/database')

const field = 'standardData.'
const value = 'pressure'

client.wrap(async () => {
  const res = await client.devices.findOne(
    {
      id: 'unit_3',
      // $and: [
      //   { [field]: { $gte: 1590553627.174376 } },
      //   { [field]: { $lte: 1590567962.530352 } },
      // ],
    },
    {
      projection: {
        _id: 0,
        'standardData.pressure': 1,
        'standardData.time': { $gte: {} },
      },
    }
  )
})

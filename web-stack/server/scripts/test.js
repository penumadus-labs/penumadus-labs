const client = require('../controllers/database')

const field = 'standardData.'
const value = 'pressure'

client.wrap(async () => {
  const res = await client.devices.aggregate([
    {$match: {id: 'unit_3'}},
    { $unwind: '$standardData' },
  ]).toArray()

  console.log(res)
})

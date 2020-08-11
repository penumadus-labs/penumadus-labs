
const client = require('../controllers/database')

client.wrap(() => {
  await client.eraseStandardData()
  await client.eraseAccelerationData()
})

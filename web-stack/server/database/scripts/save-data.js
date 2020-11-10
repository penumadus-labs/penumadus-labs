const client = require('./client')

const id = 'morganbridge'

client.wrap(async () => {
  const bridgeTest = await client.find({ id })
})

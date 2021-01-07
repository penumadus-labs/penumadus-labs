const { join } = require('path')
const client = require('../server/database/client')
const { lookup } = require('./scratch')
// const { schemas } = require('../server/database/schemas')

const id = 'morganbridge'
const dest = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'save-data-from-db',
  'nov-23-20-epoxy-temperatures'
)

const createCsv = async () => {
  const start = new Date('11-23-20').getTime() / 1000
  const end = new Date('11-24-20').getTime() / 1000

  const { data } = await client.getLinearData({
    id,
    field: 'environment',
    start,
    end,
    limit: null,
  })

  // const csv = unparse(data)

  // writeFileSync(dest + '/deflection-data.csv', csv)
}

const getAccelerationEvent = async () => {
  const { data } = await client.getAccelerationEvent({
    id,
    index: 0,
    limit: 1000,
  })
}

const sortData = async () => {
  const { data } = await client.getLinearData({
    id,
    field: 'environment',
    limit: null,
  })

  data.sort((a, b) => a.time - b.time)

  await client.devices.updateOne({ id }, { $set: { environment: data } })
}

const createUserDocument = (username, password, admin = true) => ({
  username,
  password,
  admin,
})

const users = []

const insertUsers = () =>
  Promise.all(users.map((user) => client.insertUser(user)))

const test = async () => {}

const showUsers = async () => {
  const users = await client.users.find().toArray()
}

const insertUser = () => client.insertUser()

const getTimeZone = async () => {
  const device = await client.devices.findOne({ id })
}

// const data = require('../../../../Desktop/bridge-test-data.json')[0]

// delete data._id
// data.id = 'bridge_test'
// data.udpPort = 50000
// data.deviceType = 'bridge'
// data.configurable = false
// data.acceleration = data.acceleration.slice(0, 5)
// data.deflection = data.deflection.slice(0, 100)
// data.environment = data.environment.slice(0, 100)

client.wrap(lookup)

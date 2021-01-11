const { join } = require('path')
const db = require('../server/database/client')
const { lookup } = require('./scratch')
const [
  { acceleration, environment, deflection },
] = require('../data/bridge-test-data.json')

const id = 'morganbridge'

const insertAcceleration = async () => {
  for (const event of acceleration) {
    await db.insertAccelerationEvent(id, event)
  }
}

const insertLinear = async (field, data) => db.insertLotsOfData(field, id, data)

const insertData = async () => {
  const proms = [
    insertLinear('environment', environment),
    // insertLinear('deflection', deflection),
  ]
  try {
    return Promise.all(proms)
  } catch (error) {
    console.error(error)
  }
}

const createCsv = async () => {
  const start = new Date('11-23-20').getTime() / 1000
  const end = new Date('11-24-20').getTime() / 1000

  const { data } = await db.getLinearData({
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
  const { data } = await db.getAccelerationEvent({
    id,
    index: 0,
    limit: 1000,
  })
}

const sortData = async () => {
  const { data } = await db.getLinearData({
    id,
    field: 'environment',
    limit: null,
  })

  data.sort((a, b) => a.time - b.time)

  await db.devices.updateOne({ id }, { $set: { environment: data } })
}

const createUserDocument = (username, password, admin = true) => ({
  username,
  password,
  admin,
})

const users = []

const insertUsers = () => Promise.all(users.map((user) => db.insertUser(user)))

const test = async () => {}

const showUsers = async () => {
  const users = await db.users.find().toArray()
}

const insertUser = () => db.insertUser()

const getTimeZone = async () => {
  const device = await db.devices.findOne({ id })
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

db.wrap(insertData)

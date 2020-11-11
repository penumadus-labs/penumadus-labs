const { MongoClient } = require('mongodb')
const getLinearData = require('./queries/get-linear-data')
const getAccelerationEventTimes = require('./queries/get-acceleration')
const getAccelerationEvent = require('./queries/get-acceleration-event')
const { createDeviceSchema, schemas } = require('./schemas')
const tunnel = require('../utils/ssh-tunnel')
const startProcess = require('../commands/start-mongod')

const defaultUdpPortIndex = 30000

const url = process.env.AWS_SERVER
  ? 'mongodb://caro:Matthew85!!@localhost/admin'
  : 'mongodb://localhost'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect(ssh = !process.env.AWS_SERVER) {
    if (ssh) await tunnel(27017)
    else await startProcess()

    await mongoClient.connect()

    console.info('mongo client connected')

    client.app = await mongoClient.db('app')

    client.devices = await client.app.collection('devices')
    await client.getDeviceSchemas(true)
    client.users = await client.app.collection('users')

    appData = await client.app.collection('data')
    const [{ _id }] = await appData.find().toArray()

    client.appData = new Proxy(appData, {
      get: (obj, prop) => (...args) => obj[prop]({ _id }, ...args),
    })
  },
  async close() {
    try {
      await mongoClient.close()
      console.info('database client disconnected')
    } catch (error) {
      console.error(error)
    }
  },
  async wrap(promise) {
    try {
      await client.connect(true)
      if (promise) await promise()
    } catch (error) {
      console.error(error)
    } finally {
      client.close()
    }
  },
  findUser(username) {
    return client.users.findOne({ username })
  },
  // appData(op, ...params) {
  //   return client.appData[op](client.appDataQuery, ...params)
  // },
  async getUdpPortIndex() {
    const { udpPortIndex } = await client.appData.findOne()
    await client.appData.updateOne({ $inc: { udpPortIndex: 1 } })
    return udpPortIndex
  },
  async getDeviceSchemas(store = false) {
    const schemas = await client.devices
      .find(
        {},
        {
          projection: {
            _id: 0,
            id: 1,
            deviceType: 1,
            dataFields: 1,
            configurable: 1,
          },
        }
      )
      .toArray()

    if (store)
      client.schemas = schemas.reduce(
        (o, schema) => ({ ...o, [schema.id]: schema }),
        {}
      )

    return schemas
  },
  resetUdpPortIndex() {
    return client.appData.updateOne({
      $set: { udpPortIndex: defaultUdpPortIndex },
    })
  },
  async insertDevice({ deviceType, id }) {
    const udpPort = await client.getUdpPortIndex()
    const deviceModel = createDeviceModel({ deviceType, id, udpPort })
    client.devices.insertOne(deviceModel)
    return udpPort
  },
  async getUdpPorts() {
    const devices = await client.devices.find().toArray()
    return devices.map(({ udpPort }) => udpPort)
  },
  pushData(id, data, field) {
    return client.devices
      .updateOne({ id }, { $push: { [field]: data } })
      .catch(console.error)
  },
  insertEnvironment(id, data) {
    return client.pushData(id, data, 'environment')
  },
  insertDeflection(id, data) {
    return client.pushData(id, data, 'deflection')
  },
  insertAccelerationEvent(id, event) {
    return client.pushData(
      id,
      {
        $each: [event],
        $position: 0,
      },
      'acceleration'
    )
  },

  findDevice(id, projection) {
    projection._id = 0
    return client.devices.findOne({ id }, { projection })
  },
  // async getEnvironmentReduced({ id, ...params }) {
  //   const res = await client.findDevice(id, getEnvironment(params, true))
  //   if (id === 'bridgetest') return res
  //   for (const d of res.data) d.pressure = Math.floor(d.pressure / 100)

  //   return res
  // },
  // async getEnvironment({ id, ...params }) {
  //   return client.findDevice(id, getEnvironment({ ...params }))
  // },
  getLinearData({ id, ...params }) {
    return client.findDevice(id, getLinearData({ ...params }))
  },
  async getAcceleration({ id }) {
    const { data } = await client.findDevice(id, getAccelerationEventTimes())
    return data
  },
  getAccelerationEvent({ id, ...params }) {
    return client.findDevice(id, getAccelerationEvent(params))
  },
  deleteField(id, field) {
    client.devices.updateOne({ id }, { $set: { [field]: [] } })
  },
  deleteEnvironment({ id }) {
    client.deleteField(id, 'environment')
  },
  deleteAcceleration({ id }) {
    client.deleteField(id, 'acceleration')
  },
}

// client.test = async () => {
//   await client.resetUdpPortIndex()
// }

module.exports = client

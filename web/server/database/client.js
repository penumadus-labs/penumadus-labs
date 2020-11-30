const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '..', '.env') })

const { MongoClient } = require('mongodb')
const getLinearData = require('./queries/get-linear-data')
const getAccelerationEventTimes = require('./queries/get-acceleration')
const getAccelerationEvent = require('./queries/get-acceleration-event')
const { createDeviceSchema, deviceSchemas } = require('./schemas')
// const startProcess = require('../commands/start-mongod')

const defaultUdpPortIndex = 30000

const awsServer = !!process.env.AWS_SERVER
const { DB_USER, DB_PWD } = process.env

if (!DB_USER && !DB_PWD)
  throw new Error(
    'no database credentials provided, please but DB_USER and DB_PWD a .env file'
  )

const uri = `mongodb://${DB_USER}:${DB_PWD}@${
  awsServer ? 'localhost' : '52.14.30.58'
}/admin`

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect() {
    // if (awsServer) await startProcess()

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
  // ^^ if I change my mind about the proxy
  // appData(op, ...params) {
  //   return client.appData[op](client.appDataQuery, ...params)
  // },
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
      await client.connect()
      if (typeof promise === 'function') await promise()
    } catch (error) {
      console.error(error)
    } finally {
      client.close()
    }
  },
  findUser(username) {
    return client.users.findOne({ username })
  },

  async getUdpPortIndex() {
    const { udpPortIndex } = await client.appData.findOne()
    await client.appData.updateOne({ $inc: { udpPortIndex: 1 } })
    return udpPortIndex
  },
  async getDeviceSchemas(store = false) {
    const schemas = {}

    const query = process.env.MODE ? { deviceType: process.env.MODE } : {}
    await client.devices
      .find(query, {
        projection: {
          _id: 0,
          id: 1,
          deviceType: 1,
          // dataFields: 1,
          // configurable: 1,
        },
      })
      .forEach(({ id, deviceType }) => {
        schemas[id] = {
          id,
          deviceType,
          ...deviceSchemas[deviceType],
        }
      })

    if (store) client.schemas = schemas

    return schemas
  },
  resetUdpPortIndex() {
    return client.appData.updateOne({
      $set: { udpPortIndex: defaultUdpPortIndex },
    })
  },
  async insertDevice(props) {
    const udpPort = await client.getUdpPortIndex()
    const deviceModel = createDeviceSchema({ udpPort, ...props })
    client.devices.insertOne(deviceModel)
    return udpPort
  },
  async getUdpPorts() {
    const devices = await client.devices.find().toArray()
    return devices.map(({ udpPort }) => udpPort)
  },
  pushData(id, data, field) {
    return client.devices.updateOne({ id }, { $push: { [field]: data } })
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

  getDeviceData(id, projection) {
    projection._id = 0
    return client.devices.findOne({ id }, { projection })
  },
  getLinearData({ id, ...params }) {
    return client.getDeviceData(id, getLinearData(params))
  },
  async getAcceleration({ id }) {
    const { data } = await client.getDeviceData(id, getAccelerationEventTimes())
    return data
  },
  getAccelerationEvent({ id, ...params }) {
    return client.getDeviceData(id, getAccelerationEvent(params))
  },
  deleteField({ id, field }) {
    return client.devices.updateOne({ id }, { $set: { [field]: [] } })
  },
}

// client.test = async () => {
//   await client.resetUdpPortIndex()
// }

module.exports = client

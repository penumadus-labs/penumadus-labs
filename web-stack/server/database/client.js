const { MongoClient } = require('mongodb')
const getStandardData = require('./queries/get-standard-data')
const getAccelerationEventTimes = require('./queries/get-acceleration-events')
const getAccelerationEvent = require('./queries/get-acceleration-event')
const createDeviceModel = require('./models/device')
const tunnel = require('../utils/ssh-tunnel')
const exec = require('util').promisify(require('child_process').exec)

const defaultUdpPortIndex = 30000

const url = process.env.amazon
  ? 'mongodb://caro:Matthew85!!@localhost/admin'
  : 'mongodb://localhost'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async startProcess() {
    try {
      await exec('pgrep -x mongod')
      console.info('mongod running')
    } catch (e) {
      await exec('sudo service mongod start')
      console.info('mongod started')
    }
  },
  async connect(ssh = !process.env.amazon) {
    if (ssh) await tunnel(27017)
    else await client.startProcess()

    await mongoClient.connect()

    console.info('mongo client connected')

    client.app = await mongoClient.db('app')

    client.devices = await client.app.collection('devices')
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
  appData(op, ...params) {
    return client.appData[op](client.appDataQuery, ...params)
  },
  async getUdpPortIndex() {
    const { udpPortIndex } = await client.appData.findOne()
    await client.appData.updateOne({ $inc: { udpPortIndex: 1 } })
    return udpPortIndex
  },
  resetUdpPortIndex() {
    return client.appData.updateOne({
      $set: { udpPortIndex: defaultUdpPortIndex },
    })
  },
  async insertDevice({ id }) {
    const udpPort = await client.getUdpPortIndex()
    const deviceModel = createDeviceModel({ id, udpPort })
    client.devices.insertOne(deviceModel)
    return udpPort
  },
  async getUdpPorts() {
    const devices = await client.devices.find().toArray()
    return devices.map(({ udpPort }) => udpPort)
  },
  insertStandardData(id, data) {
    return client.devices
      .updateOne({ id }, { $push: { standardData: data } })
      .catch(console.error)
  },
  insertAccelerationEvent(id, event) {
    client.devices
      .updateOne(
        { id },
        {
          $push: {
            accelerationEvents: {
              $each: [event],
              $position: 0,
            },
          },
        }
      )
      .catch(console.error)
  },
  getDeviceList() {
    return client.devices.find({}, { projection: { id: 1 } }).toArray()
  },

  findDevice(id, projection) {
    projection._id = 0
    return client.devices.findOne({ id }, { projection })
  },
  async getStandardDataReduced({ id, ...params }) {
    const res = await client.findDevice(id, getStandardData(params, true))
    if (id === 'bridgetest') return res
    for (const d of res.data) d.pressure = Math.floor(d.pressure / 100)

    return res
  },
  async getStandardData({ id, ...params }) {
    return client.findDevice(id, getStandardData(params))
  },
  async getAccelerationEvents({ id }) {
    const { data } = await client.findDevice(id, getAccelerationEventTimes())
    return data
  },
  getAccelerationEvent({ id, ...params }) {
    return client.findDevice(id, getAccelerationEvent(params))
  },
  deleteField(id, field) {
    client.devices.updateOne({ id }, { $set: { [field]: [] } })
  },
  deleteStandardData({ id }) {
    client.deleteField(id, 'standardData')
  },
  deleteAccelerationEvents({ id }) {
    client.deleteField(id, 'accelerationEvents')
  },
}

// client.test = async () => {
//   await client.resetUdpPortIndex()
// }

module.exports = client

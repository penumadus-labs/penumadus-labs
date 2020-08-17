const { MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')
const paramsList = require('./queries/get-data-params')
const standardData = require('./queries/get-standard-data')
const accelerationEvents = require('./queries/get-acceleration-events')
const accelerationData = require('./queries/get-acceleration-data')

const url = process.env.SSH
  ? 'mongodb://localhost'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect(ssh = process.env.SSH) {
    if (ssh) await tunnel(27017)

    await mongoClient.connect()

    console.info('database client connected')

    client.devices = await mongoClient.db('app').collection('devices')
    client.users = await mongoClient.db('app').collection('users')
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
  insertStandardData(id, data) {
    return client.devices
      .updateOne({ id }, { $push: { standardData: data } })
      .catch(console.error)
  },
  insertAccelerationData(id, data) {
    client.devices
      .updateOne({ id }, { $push: { accelerationData: data } })
      .catch(console.error)
  },
  eraseStandardData(id) {
    client.devices.updateOne({ $set: { standardData: [] } })
  },
  eraseAccelerationData(id) {
    client.devices.updateOne({ $set: { accelerationData: [] } })
  },
  insertDevice(data) {
    return client.devices.insertOne(data)
  },
  findUser(username) {
    return client.users.findOne({ username })
  },
  insertUser(data) {
    return client.users.insertOne(data)
  },
  getDeviceList() {
    return client.devices
      .find(
        {},
        {
          projection: { id: 1 },
        }
      )
      .toArray()
  },
  getStandardData({ id, start = -Infinity, end = Infinity }) {
    return getStandardData(id, start, end)
  },
  getAccelerationEvents({ id }) {
    return getAccelerationEvents(id)
  },
  getAccelerationData(args) {
    return getAccelerationData(args)
  },
}

const getParamsList = paramsList(client)
const getStandardData = standardData(client)
const getAccelerationEvents = accelerationEvents(client)
const getAccelerationData = accelerationData(client)

module.exports = client

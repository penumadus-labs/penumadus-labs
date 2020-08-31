const { MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')
const getStandardData = require('./queries/get-standard-data')
const getAccelerationEventTimes = require('./queries/get-acceleration-event-times')
const getAccelerationEventData = require('./queries/get-acceleration-event-data')

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
  findUser(username) {
    return client.users.findOne({ username })
  },
  // eraseStandardData(id) {
  //   client.devices.updateOne({ $set: { standardData: [] } })
  // },
  // eraseAccelerationData(id) {
  //   client.devices.updateOne({ $set: { accelerationData: [] } })
  // },
  // insertDevice(data) {
  //   return client.devices.insertOne(data)
  // },

  // insertUser(data) {
  //   return client.users.insertOne(data)
  // },
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
            events: {
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
  async getStandardData({ id, ...params }) {
    const res = await client.findDevice(id, getStandardData(params))
    for (const d of res.data) {
      d.pressure = Math.floor(d.pressure / 100)
    }

    return res
  },
  async getAccelerationEventTimes({ id }) {
    const { data } = await client.findDevice(id, getAccelerationEventTimes())
    return data
  },
  getAccelerationEventData({ id, ...params }) {
    return client.findDevice(id, getAccelerationEventData(params))
  },
}

module.exports = client

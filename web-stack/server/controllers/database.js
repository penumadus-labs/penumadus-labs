const { connect, MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')

const url = process.env.SSH
  ? 'mongodb://localhost/admin'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect() {
    if (process.env.SSH) await tunnel(27017)

    await mongoClient.connect()
    console.log('database client connected')

    client.devices = mongoClient.db('app').collection('devices')
  },
  // readTest() {
  //   return client.db('test').collection('environ_data').find().toArray()
  // },
  // insertOne(col, doc) {
  //   return client.db('app').collection('devices').insertOne(doc)
  // },
  insertStandardData(id, data) {
    client.devices
      .updateOne({ id }, { $push: { standardData: data } })
      .catch(console.error)
  },
  inesertAccelerationData(id, data) {
    client.devices
      .updateOne({ id }, { $push: { accelerationData: data } })
      .catch(console.error)
  },
  getDeviceData(id) {
    return client.devices.findOne({ id })
  },
}

module.exports = client

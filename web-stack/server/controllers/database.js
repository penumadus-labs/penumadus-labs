const { connect, MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')
const queries = require('../utils/queries')

const url = process.env.SSH
  ? 'mongodb://localhost/admin'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect(db = 'app') {
    if (process.env.SSH) await tunnel(27017)

    await mongoClient.connect()

    console.log('database connection opened')

    client.devices = await mongoClient.db(db).collection('devices')
    client.users = await mongoClient.db(db).collection('users')
  },
  // readTest() {
  //   return client.db('test').collection('environ_data').find().toArray()
  // },
  // insertOne(col, doc) {
  //   return client.db('app').collection('devices').insertOne(doc)
  // },
  async close() {
    try {
      await mongoClient.close()
      console.log('database connection closed')
    } catch (error) {
      console.error(error)
    }
  },
  async wrap(op) {
    try {
      await client.connect()
      if (op) await op()
    } catch (error) {
      console.error(error)
    } finally {
      client.close()
    }
  },
  insertStandardData(id, data) {
    client.devices
      .updateOne({ id }, { $push: { standardData: data } })
      .catch(console.error)
  },
  insertAccelerationData(id, data) {
    client.devices
      .updateOne({ id }, { $push: { accelerationData: data } })
      .catch(console.error)
  },
  async getDeviceData(id) {
    // return client.devices.findOne({ id })
    const results = {}
    await Promise.all(
      queries.map(({ label, field, projection }) =>
        client.devices.findOne({ id }, { projection }).then((res) => {
          results[label] = res[field]
        })
      )
    )

    return results
  },
  insertDevice: (data) => {
    return client.devices.insertOne(data)
  },
  findUser(username) {
    return client.users.findOne({ username })
  },
  insertUser(data) {
    return client.users.insertOne(data)
  },
}

module.exports = client

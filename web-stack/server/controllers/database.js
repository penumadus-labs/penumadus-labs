const { connect, MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')
const queries = require('../utils/queries')

const url = process.env.SSH
  ? 'mongodb://localhost'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect(db = 'app') {
    if (process.env.SSH) await tunnel(27017)

    await mongoClient.connect()

    console.info('database client connected')

    client.devices = await mongoClient.db(db).collection('devices')
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
  // async getStartTime(id) {
  //   const res = await client.devices.findOne({ id })
  //   return res.standardData[0].time
  // },
  async getDeviceData(id) {
    const results = { standard: {}, acceleration: {} }
    const standard = Promise.all(
      queries.standard.map(({ label, field, projection }) =>
        client.devices.findOne({ id }, { projection }).then((res) => {
          // res[field].sort((a, b) => a.time - b.time)
          results.standard[label] = res[field]
        })
      )
    )

    const acceleration = Promise.all(
      queries.acceleration.map(({ label, field, projection }) =>
        client.devices.findOne({ id }, { projection }).then((res) => {
          // res[field].sort((a, b) => a.time - b.time)
          results.acceleration[label] = res[field]
        })
      )
    )

    await Promise.all([standard, acceleration])

    return results
  },
  async getStandardData({ id, start = -Infinity, end = Infinity }) {
    const res = {}
    const proms = queries.standard.map(({ label }) =>
      client.queryStandardData(id, label, start, end).then((data) => {
        res[label] = data
      })
    )

    await Promise.all(proms)

    return res
  },
  async queryStandardData(id, label, start, end) {
    const res = await client.devices
      .aggregate([
        { $match: { id: 'unit_3' } },
        {
          $project: {
            ['standardData.' + label]: 1,
            'standardData.time': 1,
          },
        },
        {
          $project: {
            standardData: {
              $filter: {
                input: '$standardData',
                as: 'standardData',
                cond: {
                  $and: [
                    { $gte: ['$$standardData.time', +start] },
                    { $lte: ['$$standardData.time', +end] },
                  ],
                },
              },
            },
          },
        },
      ])
      .toArray()
    return res[0].standardData
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
}

module.exports = client

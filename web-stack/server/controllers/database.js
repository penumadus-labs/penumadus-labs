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
  getDataAsList(field, { id, start = -Infinity, end = Infinity }) {
    return client.devices
      .aggregate([
        { $match: { id } },
        { $sort: { [field + '.time']: -1 } },
        {
          $project: {
            data: {
              $filter: {
                input: '$' + field,
                as: field,
                cond: {
                  $and: [
                    { $gte: [`$$${field}.time`, +start] },
                    { $lte: [`$$${field}.time`, +end] },
                  ],
                },
              },
            },
          },
        },
      ])
      .toArray()
      .then((res) => res[0].data)
  },
  async getDataAsLists(field, { id, start = -Infinity, end = Infinity }) {
    const res = {}
    const proms = queries.standard.map(({ label }) =>
      client.queryItem(field, id, label, start, end).then((data) => {
        res[label] = data
      })
    )

    await Promise.all(proms)

    return res
  },
  queryItem(field, id, label, start, end) {
    return client.devices
      .aggregate([
        { $match: { id } },
        {
          $project: {
            [field + '.' + label]: 1,
            [field + '.time']: 1,
          },
        },
        // shouldn't need, but... :/
        { $sort: { [field + '.time']: -1 } },
        {
          $project: {
            [field]: {
              $filter: {
                input: '$' + field,
                as: field,
                cond: {
                  $and: [
                    { $gte: [`$$${field}.time`, +start] },
                    { $lte: [`$$${field}.time`, +end] },
                  ],
                },
              },
            },
            [field]: {
              $slice: ['$' + field, 5],
            },
            // [field]: {
            //   $reduce: {
            //     input: '$' + field,
            //     initialValue: [],
            //     in: {
            //       $concatArrays: [
            //         '$$value',
            //         ['$$this.time', '$$this.' + label],
            //       ],
            //     },
            //   },
            // },
          },
        },
        // {
        //   $project: {
        //     [field]: {
        //       $slice: ['$' + field, 1000],
        //     },
        //   },
        // },
      ])
      .toArray()
      .then((res) => res[0][field])
  },

  getStandardAsList(ctx) {
    return client.getDataAsList('standardData', ctx)
  },
  getStandardAsLists(ctx) {
    return client.getDataAsLists('standardData', ctx)
  },
  getAccelerationAsList(ctx) {
    return client.getDataAsList('accelerationData', ctx)
  },
  getAccelerationAsLists(ctx) {
    return client.getDataAsLists('accelerationData', ctx)
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

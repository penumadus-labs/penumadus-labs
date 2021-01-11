require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const { MongoClient } = require('mongodb')
const { hash } = require('bcrypt')

const { expectString } = require('@web/utils/error')

const { createDeviceSchema } = require('./schemas')
const { increment, resolveData } = require('./utils')

const defaultUdpPortIndex = 30000

class DatabaseClient {
  silent = false
  constructor({ DB_USER, DB_PWD, DB_URL }) {
    if (!DB_URL || !DB_USER || !DB_PWD)
      throw new Error(
        'no database credentials provided, please put DB_URl DB_USER DB_PWD a .env file in the database directory'
      )

    this.uri = `mongodb://${DB_USER}:${DB_PWD}@${DB_URL ?? 'localhost'}/admin`
  }

  connect = async (uri = this.uri, initialize) => {
    const connection = (this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }))
    this.db = connection.db.bind(connection)

    if (!this.silent) console.info('mongo client connected')

    if (initialize)
      await connection
        .db('app')
        .collection('data')
        .insertOne({ udpPortIndex: defaultUdpPortIndex })

    await connection
      .db('app')
      .collection('devices')
      .createIndex({ id: 1 }, { unique: true })

    this.app = await this.db('app')

    this.users = await this.app.collection('users')

    this.devices = await this.app.collection('devices')
    this.schemas = await this.getDevices()

    const appData = await this.app.collection('data')
    const { _id } = await appData.findOne()

    this.appData = new Proxy(appData, {
      get: (obj, prop) => (...args) => obj[prop]({ _id }, ...args),
    })
  }
  close = async () => {
    try {
      await this.connection.close()
      if (!this.silent) console.info('database client disconnected')
    } catch (error) {
      console.error(error)
    }
  }
  wrap = async (promise = () => {}) => {
    try {
      await this.connect()
      await promise()
    } catch (error) {
      console.error(error)
    } finally {
      await this.connection.close()
      console.info('database closed')
    }
  }

  findUser = (username) => {
    return this.users.findOne({ username })
  }
  getUdpPortIndex = async () => {
    const { value } = await this.appData.findOneAndUpdate({
      $inc: { udpPortIndex: 1 },
    })
    return value.udpPortIndex
  }
  getDevices = async () => {
    const schemas = {}

    const mode = process.env.MODE

    const query = mode ? { deviceType: mode } : {}

    await this.devices
      .find(query, {
        projection: {
          _id: 0,
        },
      })
      .forEach((device) => (schemas[device.id] = device))

    return schemas
  }
  resetUdpPortIndex = () => {
    return this.appData.updateOne({
      $set: { udpPortIndex: defaultUdpPortIndex },
    })
  }
  insertUser = async (user) => {
    user.password = await hash(user.password, 10)
    return this.users.insertOne(user)
  }
  insertDevice = async (props) => {
    const udpPort = await this.getUdpPortIndex()
    const schema = createDeviceSchema({ udpPort, ...props })
    await this.devices.insertOne(schema)
    await Promise.all(
      schema.dataTypes.map((dataType) =>
        this.db(dataType).collection(props.id).createIndex({
          index: 1,
          time: 1,
        })
      )
    )
    this.schemas = await this.getDevices()
    return udpPort
  }
  removeDevice = async (id) => {
    const {
      value: { dataTypes },
    } = await this.devices.findOneAndDelete({ id })
    this.schemas = await this.getDevices()
    return Promise.all(
      dataTypes.map((type) => this.db(type).dropCollection(id))
    )
  }

  getUdpPorts = async () => {
    return Object.values(this.schemas).map(({ udpPort }) => udpPort)
  }

  data({ field, id }) {
    expectString(field)
    expectString(id)
    return this.db(field).collection(id)
  }

  acceleration(id) {
    return this.data({ field: 'acceleration', id })
  }

  async incrementCounterAndAddIndexToData(field, id, data) {
    const {
      counters: { [field]: index },
    } = await increment(this.devices, { id }, `counters.${field}`)
    return { index, ...data }
  }

  insertData = async (field, id, data) => {
    return this.data({ field, id }).insertOne(
      await this.incrementCounterAndAddIndexToData(field, id, data)
    )
  }

  insertLotsOfData = async (field, id, arrayOfData) => {
    const n = arrayOfData.length
    const {
      counters: { [field]: index },
    } = await increment(this.devices, { id }, `counters.${field}`, n)

    return this.data({ field, id }).insertMany(
      arrayOfData.map((data, i) => ({ index: index + i, ...data }))
    )
  }

  insertAccelerationEvent = async (id, event) => {
    return this.acceleration(id).insertOne(
      await this.incrementCounterAndAddIndexToData('acceleration', id, {
        time: event[0].time,
        data: event,
      })
    )
  }

  getAcceleration = ({ id }) => {
    return this.acceleration(id)
      .find()
      .sort({ time: -1 })
      .map(({ time }) => time)
      .toArray()
  }

  getAccelerationEvent = async ({ id, time }) => {
    const col = await this.acceleration(id)

    return resolveData(
      col,
      async () =>
        (
          await col.findOne({
            time: time ?? (await this.getAcceleration({ id }))[0],
          })
        ).data
    )
  }
  getDataRecent = async ({ limit = 1000, ...ctx }) => {
    const col = await this.data(ctx)

    return resolveData(col, async () =>
      col
        .find()
        .sort({ time: 1 })
        .project({ _id: 0, index: 0 })
        .limit(+limit)
        .toArray()
    )
  }
  getDataRange = async ({ start, end, limit, ...ctx }) => {
    const handleLimit = limit
      ? [
          {
            $bucketAuto: {
              groupBy: '$time',
              buckets: +limit,
              output: {
                docs: { $push: '$$CURRENT' },
              },
            },
          },
          { $replaceWith: { $first: '$docs' } },
        ]
      : []

    const col = await this.data(ctx)

    return resolveData(col, async () =>
      this.data(ctx)
        .aggregate([
          {
            $match: {
              time: { $gte: +start || -Infinity, $lte: +end || Infinity },
            },
          },
          ...handleLimit,
          { $sort: { time: 1 } },
          { $project: { _id: 0, index: 0 } },
        ])
        .toArray()
    )
  }
  resetCounter({ field, id }) {
    return this.devices.updateOne(
      { id },
      { $set: { [`counters.${field}`]: 0 } }
    )
  }
  deleteData = (ctx) => {
    return Promise.all([this.data(ctx).deleteMany(), this.resetCounter(ctx)])
  }
}

module.exports = new DatabaseClient(process.env)

if (require.main === module) (() => client.connect())()

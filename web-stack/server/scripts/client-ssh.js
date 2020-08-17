const { MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')
const queries = require('../utils/queries')

const url = 'mongodb://localhost'

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const client = {
  async connect(db = 'app') {
    await tunnel(27017)

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
}

module.exports = client

const { connect, MongoClient } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')

const development = process.env.NODE_ENV === 'development'

const url = development
  ? 'mongodb://localhost/admin'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const dbClient = {
  db: null,
  async dbClientConnect(db = 'hank_1') {
    await tunnel(27017)

    await client.connect()
    console.log('database client connected')
    dbClient.db = client.db(db)
  },
  readTest() {
    return dbClient
      .db('test')
      .collection('environ_data')
      .find()
      .toArray()
  },
  insertOne(db, col, doc) {
    return dbClient
      .db(db)
      .collection(col)
      .insertOne(doc)
  },
}

module.exports = dbClient

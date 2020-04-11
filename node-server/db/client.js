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
  async dbClientConnect(db = 'test') {
    await tunnel(27017)

    await client.connect()
    console.log('database connected')
    dbClient.db = client.db(db)
  },
  read(col) {
    return dbClient.db
      .collection(col)
      .find()
      .toArray()
  },
  insertOne(col, doc) {
    return dbClient.db.collection(col).insertOne(doc)
  },
}

module.exports = dbClient

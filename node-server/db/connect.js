const { connect } = require('mongodb')
const tunnel = require('./ssh-tunnel')

const development = process.env.NODE_ENV === 'development'

const url = development
  ? `mongodb://localhost/admin`
  : `mongodb://caro:Matthew85!!@localhost/test`

module.exports = async () => {
  if (development) await tunnel()

  const client = await connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('database connected')

  return client
}

const { connect } = require('mongodb')
const tunnel = require('../utils/ssh-tunnel')

const development = process.env.NODE_ENV === 'development'

const url = development
  ? 'mongodb://localhost/admin'
  : 'mongodb://caro:Matthew85!!@localhost/admin'

module.exports = async () => {
  await tunnel(27017)

  const client = await connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('database connected')

  return client
}

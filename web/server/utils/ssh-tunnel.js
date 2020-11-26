/* this code maps a port from the server to the local machine for development */
const { readFileSync } = require('fs')
const tunnel = require('tunnel-ssh')
const { join } = require('path')

console.log(join(__dirname, '..', '..', 'keys'))

module.exports = (port) => {
  const config = {
    username: 'ubuntu',
    host: '52.14.30.58',
    port: '22',
    privateKey: raw,
  }
  return new Promise((resolve, reject) => {
    const client = tunnel({ ...config, dstPort: port.toString() }, (err) => {
      if (err) reject(err)
      console.info(`ssh tunnel opened for port ${port}`)
      resolve()
    })

    client.on('error', reject)
  })
}

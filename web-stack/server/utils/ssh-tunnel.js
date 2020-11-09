/* this code maps a port from the server to the local machine for development */
const { readFileSync } = require('fs')
const tunnel = require('tunnel-ssh')
const { join } = require('path')

module.exports = (port) => {
  const config = {
    username: 'ubuntu',
    host: process.env.SERVER_IP,
    port: '22',
    privateKey: readFileSync(join(__dirname, '..', '.ssh', 'server2.pem')),
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

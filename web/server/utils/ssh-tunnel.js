/* this code maps a port from the server to the local machine for development */
// not using anymore because my frigging pem key stopped working
const { readFileSync } = require('fs')
const tunnel = require('tunnel-ssh')
const { join } = require('path')
const privateKey = require('./key')

const sshTunnel = (module.exports = (port) => {
  const config = {
    username: 'ubuntu',
    host: '52.14.30.58',
    port: '22',
    privateKey: 'tts',
    // privateKey: readFileSync(
    //   join(
    //     __dirname,
    //     '..',
    //     '..',
    //     '..',
    //     '..',
    //     '..',
    //     '.ssh',
    //     'postapocalypse.pem'
    //   )
    // ),
  }
  return new Promise((resolve, reject) => {
    const client = tunnel({ ...config, dstPort: port.toString() }, (err) => {
      if (err) reject(err)
      console.info(`ssh tunnel opened for port ${port}`)
      resolve()
    })

    client.on('error', reject)
  })
})

if (require.main === module) {
  void (async () => {
    await sshTunnel(27017)
  })().catch(console.error)
}

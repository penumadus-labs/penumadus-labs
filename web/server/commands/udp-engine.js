const exec = require('./exec')
const { join } = require('path')
const client = require('../database/client')

const udpEngine = 'UDPengine'
const udpEnginePath = join(__dirname, '..', '..', '..', 'DM', udpEngine)

const killUdpEngines = async () => {
  try {
    await exec(`killall ${udpEngine}`)
    console.info('udp engines stopped')
  } catch ({ stderr }) {
    console.error(stderr.slice(0, -1))
  }
}

const excludedUdpPorts = [] //32159]

module.exports = async ({ tcpPort }) => {
  if (!process.env.AWS_SERVER) return
  try {
    await killUdpEngines()
    const udpPorts = (await client.getUdpPorts()).filter(
      (port) => !excludedUdpPorts.includes(port)
    )

    for (const udpPort of udpPorts)
      exec(`${udpEnginePath} ${udpPort} 127.0.0.1 ${tcpPort}`).catch(
        console.error
      )

    const s = udpPorts.length === 1 ? '' : 's'
    console.info(`udp engine${s} started on port${s}: ${udpPorts.join(', ')}`)
  } catch (error) {
    throw error.stderr ?? error
  }
}

const exec = require('./exec')
const { join } = require('path')
const database = require('../database/client')

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

const { EXCLUDED_UDP_PORTS: ports, LOCAL_SERVER } = process.env

const excludedUdpPorts = ports ? ports.split(',').map((port) => +port) : []

module.exports = async ({ tcpPort }) => {
  if (LOCAL_SERVER) return
  try {
    await killUdpEngines()
    const udpPorts = (await database.getUdpPorts()).filter(
      (port) => !excludedUdpPorts.includes(port)
    )

    for (const udpPort of udpPorts)
      exec(`${udpEnginePath} ${udpPort} 127.0.0.1 ${tcpPort}`).catch(
        console.error
      )

    console.info(`udp engine(s) started on port(s): ${udpPorts.join(', ')}`)
  } catch (error) {
    throw error.stderr ?? error
  }
}

const exec = require('util').promisify(require('child_process').exec)
const { join } = require('path')
const client = require('../database/client')

const udpEngine = 'UDPengine'
const udpDir = join(__dirname, '..', '..', '..', 'DM')

const killUdpEngines = async () => {
  try {
    await exec(`killall ${udpEngine}`)
    console.info('udp engines stopped')
  } catch ({ stderr }) {
    console.error(`udp engine: ${stderr}`)
  }
}

module.exports = async ({ tcpPort }) => {
  if (!process.env.amazon) return console.info('udp engines not started')
  await killUdpEngines()
  try {
    const udpPorts = await client.getUdpPorts()

    await Promise.all(
      udpPorts.map((udpPort) =>
        exec(
          `cd ${udpDir} && ./${udpEngine} ${udpPort} 127.0.0.1 ${tcpPort} > start.log`
        )
      )
    )

    const s = udpPorts.length === 1 ? '' : 's'
    console.info(`udp engine${s} started on port${s}: ${udpPorts.join(', ')}`)
  } catch (error) {
    throw error.stderr ?? error
  }
}

const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { join } = require('path')
const client = require('../database/client')

const udpEngine = join(__dirname, '..', '..', '..', 'DM', 'UDPEngine')

const killUdpEngines = () =>
  exec('killall udpEngine').catch(
    ({ stderr }) => void console.error(`udp engine: ${stderr}`)
  )

module.exports = async ({ tcpPort }) => {
  if (!process.env.amazon) return console.info('udp engines not started')
  await killUdpEngines()
  try {
    const udpPorts = await client.getUdpPorts()

    await Promise.all(
      udpPorts.map((udpPort) =>
        exec(`${udpEngine} ${udpPort} 127.0.0.1 ${tcpPort}`)
      )
    )

    const s = udpPorts.length === 1 ? '' : 's'
    console.info(`started udp engine${s} on port${s}: ${udpPorts.join(', ')}`)
  } catch (error) {
    throw error?.stderr ?? error
  }
}

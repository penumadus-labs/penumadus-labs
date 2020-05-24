const EventEmitter = require('events')
const controller = require('./bridge')
const { insertStandardData, insertAccelerationData } = require('./database')
const {
  config,
  streams,
  commands,
  getters,
  setters,
  table,
} = require('../utils/tcp-protocol')

/*
this class wraps the tcp client
gets all device settings when a client connects
updates all settings whenever a setter is resolved
extends EventEmitter and creates promise based methods for issuing requests to the device
*/

class Device extends EventEmitter {
  settings = {}

  constructor(socket) {
    super()
    socket.setEncoding('ascii')
    socket.on('error', console.error)
    socket.on('close', () => {
      console.log('tcp client closed')
      controller.tcpClients.delete(this)
    })

    this.socket = socket
    this.createRequestMethods()
    this.addDataStreams()
    this.socket.on('data', this.emitResponses.bind(this))
  }

  async initialize() {
    // await this.getSettings()
    controller.tcpClients.add(this)
  }

  getSettings() {
    return Promise.all(
      getters.map(({ command, dataLabel }) =>
        this.createRequest(command).then(
          (response) => (this.settings[dataLabel] = response)
        )
      )
    )
  }

  addDataStreams() {
    this.on(table['standardData'], (err, data) => {
      insertStandardData(this.id, data)
    })

    this.on(table['accelerationData'], (err, data) => {
      insertAccelerationData(this.id, data)
    })

    this.on('error', (err) => {
      console.log(`device controller error: "${err}"`)
    })
  }

  createRequest(command, ...args) {
    console.log(`request: ${table[command]}`)

    const message = args.length ? [command, ...args].join(' ') : command
    this.socket.write(message.padEnd(config.packetSize))

    return new Promise((resolve) => {
      this.once(command, (err, data) => {
        if (err) reject(err)

        resolve(data)
      })
    })
  }

  createSetter(command, requiredArgs, dataLabel) {
    return async (settings) => {
      const args = Object.values(settings)
      if (args.length !== requiredArgs) {
        throw new Error(
          `expected ${requiredArgs} args. recieved ${args.length} args`
        )
      }

      const response = await this.createRequest(command, ...args)
      this.settings[dataLabel] = settings
      return response
    }
  }

  createRequestMethods() {
    for (const { name, command } of commands) {
      this[name] = () => this.createRequest(command)
    }

    for (const { name, command, args, dataLabel } of setters) {
      this[name] = this.createSetter(command, args, dataLabel)
    }
  }

  emitResponses(raw) {
    const { pad, type: command, status, id, ...data } = JSON.parse(raw)
    if (!this.id) this.id = id
    if (command === 'HELLO') return
    if (this.listenerCount(command)) {
      const err =
        status === 'NACK' ? new Error('command not acknowledged') : null
      console.log(`response: ${table[command]}`)

      this.emit(command, err, data)
    } else {
      this.emit('error', new Error(`unhandled response ${command}`))
    }
  }

  // async test() {
  //   await this.getSettings()
  //   console.log(this.settings)

  //   await Promise.all([
  //     this.setIPSettings(this.settings.ip),
  //     this.setPressureSettings(this.settings.pressure),
  //     this.setAccelerationSettings(this.settings.acceleration),
  //     this.setSampleSettings(this.settings.sample),
  //   ])
  //   console.log(this.settings)

  //   await this.reset()
  //   console.log('finished')
  //   process.exit(0)
  // }
}

module.exports = async (socket) => {
  const device = new Device(socket)
  await device.initialize()
  return device
}

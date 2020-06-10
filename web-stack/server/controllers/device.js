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
const coerceNumbers = require('../utils/coerce-numbers')

/*
this class wraps the tcp client
gets all device settings when a client connects
updates all settings whenever a setter is resolved
extends EventEmitter and creates promise based methods for issuing requests to the device
*/

class Device extends EventEmitter {
  // settings = {}
  initialized = false

  constructor(socket) {
    super()
    socket.setEncoding('ascii')
    socket.on('error', console.error)
    socket.on('close', () => {
      console.info('tcp client closed')
      delete controller.devices[this.id]
    })

    this.socket = socket
    this.createRequestMethods()
    this.addDataStreams()
    this.socket.on('data', this.emitResponses.bind(this))
  }

  initialize(id) {
    // await this.getSettings()
    controller.devices[id] = this
    this.initialized = true
  }

  async getSettings() {
    const settings = {}

    await Promise.all(
      getters.map(({ command, dataLabel }) =>
        this.createRequest(command).then(
          ({ time, ...data }) => (settings[dataLabel] = data)
        )
      )
    )

    return settings
  }

  addDataStreams() {
    this.on(table['standardData'], (data) => {
      // insertStandardData(this.id, data)
    })

    this.on(table['accelerationData'], (data) => {
      // insertAccelerationData(this.id, data)
    })

    this.on('error', (err) => {
      console.error(`device controller error: "${err}"`)
    })
  }

  createRequest(command, args = []) {
    console.info(`request: ${table[command]}`)

    const message = args.length ? [command, ...args].join(' ') : command
    this.socket.write(message.padEnd(config.packetSize))

    return new Promise((resolve, reject) => {
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

      const response = await this.createRequest(command, args)
      // this.settings[dataLabel] = settings
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
    if (data.time) data.time = +data.time

    if (!this.initialized) this.initialize(id)
    if (command === 'HELLO') return
    if (this.listenerCount(command)) {
      console.info(`response: ${table[command]}`)

      const err =
        status === 'NACK' ? new Error('command not acknowledged') : null

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
  // await device.initialize()
  return device
}

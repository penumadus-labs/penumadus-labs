const EventEmitter = require('events')
const channel = require('./channel')
const {
  insertStandardData,
  insertAccelerationData,
  insertAccelerationEvent,
} = require('../database/client')
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
  // settings = {}
  initialized = false
  writeStandard = true
  writeAcceleration = true
  transmit = true
  timeout = null
  event = {}

  constructor(socket) {
    super()
    socket.setEncoding('ascii')
    socket.on('error', console.error)
    socket.on('close', () => {
      console.info('tcp client closed')
      delete channel.devices[this.id]
    })

    this.socket = socket
    this.createRequestMethods()
    this.addDataStreams()

    const { emitResponses } = this

    this.socket.on('readable', async function () {
      let chunk
      while ((chunk = this.read(200))) {
        emitResponses(chunk)
        await new Promise((res) => setTimeout(res, 5))
      }
    })
  }

  initialize(id) {
    // if I wanted to cache the settings
    // await this.getSettings()

    channel.devices[id] = this
    this.id = id
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
    this.on(table['standardData'], (err, data) => {
      if (this.writeStandard) insertStandardData(this.id, data)
      if (this.transmit) channel.updateUsers('standard', data)
    })

    this.on(table['accelerationData'], (err, data) => {
      if (!this.timeout) this.event = []
      else clearTimeout(this.timeout)

      this.event.push(data)
      if (this.transmit) channel.updateUsers('acceleration', data)

      this.timeout = setTimeout(() => {
        this.timeout = null
        console.info(`acceleration event: ${this.event.length}`)
        if (!this.writeAcceleration) return
        insertAccelerationEvent(this.id, this.event)
      }, 200)
    })

    this.on('error', (err) => {
      console.error(`device channel error: "${err}"`)
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

  emitResponses = (raw) => {
    const { pad, type: command, status, id, ...data } = JSON.parse(raw)

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

  //   await Promise.all([
  //     this.setIPSettings(this.settings.ip),
  //     this.setPressureSettings(this.settings.pressure),
  //     this.setAccelerationSettings(this.settings.acceleration),
  //     this.setSampleSettings(this.settings.sample),
  //   ])

  //   await this.reset()
  //   process.exit(0)
  // }
}

module.exports = async (socket) => {
  const device = new Device(socket)
  // await device.initialize()
  return device
}

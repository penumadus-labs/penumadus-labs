const EventEmitter = require('events')
const broadcaster = require('./broadcaster')
const {
  insertEnvironment,
  insertAccelerationEvent,
} = require('../database/client')
const tankProtocol = require('../protocols/tank')
const bridgeProtocol = require('../protocols/tank')

const packetSize = 200

/*
this class wraps the tcp client
gets all device settings when a client connects
updates all settings whenever a setter is resolved
extends EventEmitter and creates promise based methods for issuing requests to the device
*/

module.exports = class Device extends EventEmitter {
  // settings = {}
  // event = {}
  initialized = false
  recordData = true
  broadcastData = true

  constructor(socket) {
    super()
    socket.setEncoding('ascii')
    socket.on('error', console.error)
    socket.on('close', () => {
      console.info('udp engine disconnected')
      delete broadcaster.devices[this.id]
    })

    this.socket = socket

    this.socket.on('readable', async function () {
      let chunk
      while ((chunk = this.read(200))) {
        this.emitResponses(chunk)
        // prevent heavy synchronous operation
        await new Promise((res) => setImmediate(res))
      }
    })
  }

  emitResponses = (raw) => {
    const { pad, type: command, status, id, ...data } = JSON.parse(raw)

    if (command === 'HELLO') return

    if (!this.initialized) this.initialize(id)
    if (command === 'TIME') return console.info('request: TIME')

    if (this.listenerCount(command)) this.emit(command, status === 'NACK', data)
    else this.emit('error', new Error(`unhandled response ${command}`))
  }

  initialize(id) {
    this.attachEvents(true ? bridgeProtocol : tankProtocol)

    broadcaster.devices[id] = this
    broadcaster.updateUsers(this.id, 'settings')

    this.id = id
    this.initialized = true

    // if I wanted to cache the settings
    // await this.getSettings()
  }

  attachEvents({ commands = [], getters = [], setters = [], streams = [] }) {
    this.getters = getters

    for (const { name, command } of commands) {
      this[name] = () => this.createRequest({ command, name })
    }

    for (const { name, command, args, label } of setters) {
      this[name] = this.createSetter({ command, args, name, label })
    }

    for (const { command } of streams) {
      this.on(command, this.handlers[command])
    }

    this.on('error', (err) => {
      console.error(`device broadcaster error: "${err}"`)
    })
  }
  timeout = null
  handlers = {
    environment: (err, data) => {
      if (this.recordData) insertEnvironment(this.id, data)
      if (this.broadcastData)
        broadcaster.updateUsers(this.id, 'environment', data)
    },
    deflection: (err, data) => {
      if (this.recordData) insertDeflection(this.id, data)
      if (this.broadcastData)
        broadcaster.updateUsers(this.id, 'deflection', data)
    },
    acceleration: (err, data) => {
      if (!this.timeout) this.event = []
      else clearTimeout(this.timeout)

      this.event.push(data)
      if (this.broadcastData)
        broadcaster.updateUsers(this.id, 'acceleration', data)

      this.timeout = setTimeout(() => {
        this.timeout = null
        console.info(`acceleration event: ${this.event.length}`)
        if (!this.recordData) return
        insertAccelerationEvent(this.id, this.event)
      }, 1000)
    },
  }

  createRequest({ command, name = command, args = [] }) {
    // name ??= command
    console.info(`request: ${name}`)

    const message = args.length ? [command, ...args].join(' ') : command
    this.socket.write(message.padEnd(packetSize))

    return new Promise((resolve, reject) => {
      this.once(command, (err, data) => {
        if (err) {
          const errorMessage = `response failed: ${name} not acknowledged`
          console.error(errorMessage)
          reject(new Error(errorMessage))
        }
        console.info(`response: ${name}`)
        resolve(data)
      })
    })
  }

  createSetter({ command, requiredArgs, name, label }) {
    return async (settings) => {
      const args = Object.values(settings)
      if (args.length !== requiredArgs) {
        throw new Error(
          `expected ${requiredArgs} args. received ${args.length} args`
        )
      }

      const response = await this.createRequest({ command, name, args })
      broadcaster.updateUsers(this.id, 'settings')
      // if I wanted to cache settings
      // this.settings[label] = settings
      return response
    }
  }

  async getSettings() {
    // need to error test

    // await Promise.all(
    //   getters.map(({ command, label }) =>
    //     this.createRequest(command).then(
    //       ({ time, ...data }) => (settings[label] = data)
    //     )
    //   )
    // )

    const settings = {}

    await Promise.all(
      this.getters.map(async ({ command, name, label }) => {
        const { time, ...data } = await this.createRequest({
          command,
          name,
          label,
        })
        settings[label] = data
      })
    )

    return settings
  }
}

// module.exports = async (socket) => {
//   const device = new Device(socket)
//   // await device.initialize()
//   return device
// }

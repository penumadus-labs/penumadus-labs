const EventEmitter = require('events')
const broadcaster = require('./broadcaster')
const database = require('../database/client')
const protocols = require('../protocols')

const packetSize = 200

/*
this class wraps the tcp client
gets all device settings when a client connects
updates all settings whenever a setter is resolved
extends EventEmitter and creates promise based methods for issuing requests to the device
*/

/*
*** not implemented yet
cache settings
fetch on connect, store in object
on successful set, write settings into local state
broadcast "settings" to users
*/

// should deprecate name param on createRequest. Only used for printing info to the console

module.exports = class Device extends EventEmitter {
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

    const { emitResponses } = this

    this.socket.on('readable', async function () {
      let chunk
      while ((chunk = this.read(200))) {
        emitResponses(chunk)
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

    if (this.listenerCount(command)) {
      console.info(`response: ${command}`)
      this.emit(command, status === 'NACK', data)
    } else {
      this.emit('error', new Error(`unhandled response ${command}`))
    }
  }

  initialize(id) {
    try {
      const { deviceType } = database.schemas[id]
      this.attachEvents(protocols[deviceType])
      this.id = id
      broadcaster.devices[id] = this
      this.initialized = true
    } catch (error) {
      return console.error(new Error(`could not initialize: ${id}`))
    }
  }

  attachEvents({
    configurable = false,
    commands = [],
    getters = [],
    setters = [],
    streams = [],
  }) {
    this.getters = getters
    // testing feature cached settings
    if (configurable) this.getSettings()

    for (const { name, command } of commands) {
      this[name] = () => this.createRequest({ command, name })
    }

    for (const { name, command, args, label } of setters) {
      this[name] = this.createSetter({ command, args, name, label })
    }

    for (const { name, command } of streams) {
      this.on(command, this.handlers[name])
    }

    this.on('error', (err) => {
      console.error(`device broadcaster error: "${err}"`)
    })
  }
  timeout = null
  handlers = {
    environmental: (err, data) => {
      if (this.recordData) database.insertEnvironment(this.id, data)
      if (this.broadcastData) this.broadcast('environment', data)
    },
    deflection: (err, data) => {
      if (this.recordData) database.insertDeflection(this.id, data)
      if (this.broadcastData) this.broadcast('deflection', data)
    },
    acceleration: (err, data) => {
      if (!this.timeout) this.event = []
      else clearTimeout(this.timeout)

      this.event.push(data)
      if (this.broadcastData) this.broadcast('accelerationEvent', data)

      this.timeout = setTimeout(() => {
        this.timeout = null
        console.info(`acceleration event: ${this.event.length}`)
        if (this.recordData)
          database.insertAccelerationEvent(this.id, this.event)
      }, 1000)
    },
  }

  broadcast(type, data) {
    broadcaster.updateUsers(this.id, type, data)
  }

  createRequest({ command, name = command, args = [] }) {
    // in case the above code doesn't work
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

  createSetter({ command, args: requiredArgs, name, label }) {
    return async (data) => {
      const args = Object.values(data)
      if (args.length !== requiredArgs) {
        throw new Error(
          `expected ${requiredArgs} args. received ${args.length} args`
        )
      }

      const response = await this.createRequest({ command, name, args })
      // testing feature cached settings
      this.settings[label] = data
      this.broadcast('settings')
      return response
    }
  }

  async getSettings() {
    // testing feature cached settings
    if (this.settings) return this.settings
    this.settings = {}

    await Promise.all(
      this.getters.map(async ({ command, name, label }) => {
        const { time, ...data } = await this.createRequest({
          command,
          name,
          label,
        })
        this.settings[label] = data
      })
    )

    // testing feature cached settings
    this.broadcast('settings')
  }
}

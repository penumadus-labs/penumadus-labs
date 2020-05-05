const EventEmitter = require('events')
const controller = require('./socket-pipeline')
const { insertOne } = require('./database')
const {
  config,
  commands,
  getters,
  setters,
  table,
} = require('../protocols/tcp-protocol')

/*
this class wraps the tcp client
it grabs all device settings when a client connects
it updates all settings whenever a setter is resolved
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
    this.createRequests()
    this.addDataStreams()
    this.socket.on('data', this.emitResponses.bind(this))
  }

  async initialize() {
    await this.getSettings()
    controller.tcpClients.add(this)
    console.log(this.settings)
  }

  getSettings() {
    return Promise.all(
      getters.map(([name, { dataLabel }]) =>
        (async () => {
          this.write(name)
          const settings = await this.createPromise(name)
          this.settings[dataLabel] = settings
        })()
      )
    )
  }

  write(name, ...args) {
    console.log(`request: ${name}`)
    const command = table[name]
    const message = args.length ? [command, ...args].join(' ') : command
    this.socket.write(message.padEnd(config.packetSize))
  }

  createPromise(name) {
    return new Promise((resolve) => {
      this.once(name, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  createRequests() {
    for (const [name, _] of commands) {
      this[name] = this.createCommand(name)
    }

    for (const [name, { args, dataLabel }] of setters) {
      this[name] = this.createSetter(name, args, dataLabel)
    }
  }

  addDataStreams() {
    this.on('standardData', (data) => {})

    this.on('accelerationData', (data) => {})

    this.on('error', (err) => {
      console.log(`device controller error: "${err}"`)
    })
  }

  createCommand(name) {
    return () => {
      console.log(`request: ${name}`)
      this.write(name)
      return this.createPromise(name)
    }
  }

  createSetter(name, args, dataLabel) {
    return (settings) => {
      const params = Object.values(settings)
      if (params.length !== args) {
        throw new Error(
          `expected ${args} args. recieved ${settings.length} args`
        )
      }

      this.write(name, ...params)

      return this.createPromise(name).then((data) => {
        this.settings[dataLabel] = settings
        return data
      })
    }
  }

  emitResponses(raw) {
    const { pad, type, id, status, time, ...data } = JSON.parse(raw)
    if (!this.id) this.id = id
    if (type === 'HELLO') return
    const response = table[type]
    console.log(`response: ${response}`)

    if (this.listenerCount(response)) {
      const err =
        status === 'NACK' ? new Error('command not acknowledged') : null

      this.emit(response, err, data)
    } else {
      this.emit('error', new Error(`unhandled response ${type}`))
    }
  }

  async test() {
    const settings = await this.getAllSettings()
    console.log('get', this.settings)

    await Promise.all([
      this.setIPSettings(this.settings.ip),
      this.setPressureSettings(this.settings.pressure),
      this.setAccelerationSettings(this.settings.acceleration),
      this.setSampleSettings(this.settings.sample),
    ])
    console.log('set', this.settings)

    await this.reset()
    console.log('finished')
    process.exit(0)
  }
}

module.exports = Device

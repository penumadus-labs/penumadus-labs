const EventEmitter = require('events')
const { insertOne } = require('../controllers/database')
const {
  config,
  commands,
  getters,
  setters,
  requests,
  all,
} = require('../protocols/tcp-protocol')

class Device extends EventEmitter {
  constructor(socket) {
    super()

    this.socket = socket

    this.getters = []
    this.responses = {}

    this.createEvents()
    this.addEventListeners()
    this.socket.on('data', this.handleResponses.bind(this))
  }

  addEventListeners() {
    this.on('standardData', (data) => {})

    this.on('accelerationData', (data) => {})

    this.on('error', (err) => {
      console.log(`device controller error: "${err}"`)
    })
  }

  handleResponses(raw) {
    const { pad, type, id, status, ...data } = JSON.parse(raw)
    if (type === 'HELLO') return
    const response = this.responses[type]
    console.log(`response: ${response}`)

    if (this.listenerCount(response)) {
      const err =
        status === 'NACK' ? new Error('command not acknowledged') : null

      this.emit(response, err, data)
    } else {
      this.emit('error', new Error(`unhandled response ${type}`))
    }
  }

  getAllSettings() {
    return Promise.all(this.getters.map((getter) => this[getter]()))
  }

  createSetter(name, command, numArgs) {
    return (...args) => {
      if (args.length !== numArgs) {
        throw new Error(`expected ${numArgs} args. recieved ${args.length} args`)
      }

      return this.createRequest(name, [command, ...args].join(' '))()
    }
  }

  createRequest(name, command) {
    return () => {
      console.log(`request: ${name}`)
      this.socket.write(command.padEnd(config.packetSize))

      return new Promise((resolve) => {
        this.once(name, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
    }
  }

  createEvents() {
    for (const [name, { command }] of commands) {
      this[name] = this.createRequest(name, command)
    }

    for (const [name, { command }] of getters) {
      this.getters.push(name)
      this[name] = this.createRequest(name, command)
    }

    for (const [name, { command, args }] of setters) {
      this[name] = this.createSetter(name, command, args)
    }

    for (const [name, { command, args }] of all) {
      this.responses[command] = name
    }
  }
}

module.exports = Device

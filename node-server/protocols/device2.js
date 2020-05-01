const { events } = require('./tcp-protocol')

const EventEmitter = require('events')

class Device extends EventEmitter {
  constructor(socket) {
    this.socket = socket
    this.settings = {}
    this.online = false

    socket.on('data', this.handleData.bind(this))

    const eventEntries = Object.entries(requests)

    eventEntries.forEach(([name, { request, response }]) => {
      this[name] = (...args) => {
        console.log(`request: ${name}`)
        socket.write(request(...args))
        return new Promise((resolve, reject) => {
          this.once(response, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        })
      }
    })

    void (async () => {
      const settings = await Promise.all([
        this.getIPSettings(),
        this.getPressureSettings(),
        this.getAccelerationSettings(),
        this.getSampleSettings(),
      ])

      console.log(settings)
    })().catch(console.error)
  }

  async handleData(raw) {
    try {
      const { pad, type, id, time, ...data } = JSON.parse(raw)
      if (type === 'HELLO') return
      const response = responses[type]
      if (this[response]) {
        console.log(`response: ${type}`, data)
        this.emit(response, null, data)
      } else console.log(`unknown type ${type}`, data)
    } catch (error) {
      console.error(error)
    }
  }
}

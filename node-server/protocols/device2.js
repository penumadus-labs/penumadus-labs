const { events, responses } = require('./tcp-protocol')

const EventEmitter = require('events')

class Device extends EventEmitter {
  constructor(socket) {
    super()
    this.socket = socket
    this.settings = {}
    this.online = false

    this.timeout = 10000

    socket.on('data', this.handleData.bind(this))

    const eventEntries = Object.entries(events)

    // add request methods
    eventEntries.forEach(([name, { request, response }]) => {
      this[name] = (...args) => {
        console.log(`request: ${name}`)

        socket.write(request(...args))

        return new Promise((resolve, reject) => {
          // setTimeout(
          //   () => reject(new Error(`${name} response timed out`)),
          //   this.timeout
          // )

          this.once(response, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        })
      }
    })

    // add event listeners

    this.on('standardDataResponse', data => {
      console.log('standard')
    })

    this.on('accelerationDataResponse', data => {
      console.log('acceleration')
    })

    void (async () => {
      const settings = await this.getAllSettings()

      console.log(settings)
    })().catch(console.error)
  }

  async handleData(raw) {
    try {
      const { pad, type, id, time, ...data } = JSON.parse(raw)
      if (type === 'HELLO') return
      const response = responses[type]
      console.log(response)
      if (response) {
        console.log(`response: ${type}`, data)
        this.emit(response, null, data)
      } else console.log(`unknown type ${type}`, data)
    } catch (error) {
      console.error(error)
    }
  }

  getAllSettings() {
    return Promise.all([
      this.getIPSettings(),
      this.getPressureSettings(),
      this.getAccelerationSettings(),
      this.getSampleSettings(),
    ])
  }
}

module.exports = Device

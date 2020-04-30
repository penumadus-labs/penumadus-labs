const { requests, responses } = require('./tcp-protocol')

class Device {
  constructor(socket) {
    this.socket = socket
    this.settings = {}
    this.online = false

    socket.on('data', this.handleData.bind(this))

    const requestNames = Object.keys(requests)

    requestNames.forEach((name) => {
      const request = requests[name]
      this[name] = (...args) => {
        socket.write(request(...args))
      }
    })

    this.getIPSettings()
    this.getSampleSettings()
    this.getPressureSettings()
    this.getAccelerationSettings()
  }
  async handleData(raw) {
    try {
      const { type, pad, id, ...data } = JSON.parse(raw)
      if (type === 'HELLO') return
      const response = responses[type]
      console.log(response)
      if (this[response]) this[response](data)
      else console.log(`unknown type ${type}`)
      this.setStatus()
    } catch (error) {
      console.error(error)
    }
  }

  setStatus() {
    this.online = true
    setTimeout(() => (this.online = false), 10000)
  }

  // responses

  standardDataResponse(data) {}
  accelerationDataResponse(data) {}
  logDataResponse(data) {}

  shutdownResponse(data) {}
  commitResponse(data) {}
  eraseBufferedDataResponse(data) {}

  getIPSettingsResponse(data) {
    this.settings.ip = data
  }
  getPressureSettingsResponse(data) {
    this.settings.pressure = data
  }
  getAccelerationSettingsResponse(data) {
    this.settings.acceleration = data
  }
  getSampleSettingsResponse(data) {
    this.settings.sample = data
  }
  setIPSettingsResponse(data) {}
  setPressureSettingsResponse(data) {}
  setAccelerationSettingsResponse(data) {}
  setSampleSettingsResponse(data) {}
}

module.exports = Device

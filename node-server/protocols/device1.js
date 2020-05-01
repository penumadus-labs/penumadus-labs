const { requests, responses } = require('./tcp-protocol')

class Device {
  constructor(socket) {
    this.socket = socket
    this.settings = {}
    this.online = false

    socket.on('data', this.handleData.bind(this))

    const requestEntries = Object.entries(requests)

    requestEntries.forEach(([name, request]) => {
      this[name] = (...args) => {
        console.log(`request: ${name}`)
        socket.write(request(...args))
      }
    })
    // this.setTime()

    // this.shutdown()
    // this.reset()

    // this.commitSettings()
    // this.eraseBufferedData()

    // this.getIPSettings()
    // this.getPressureSettings()
    // this.getAccelerationSettings()
    // this.getSampleSettings()

    // this.setIPSettings('18.222.29.175', '32159')
    // this.setPressureSettings(1, 1, 1, 2, 1, 1, 1)
    // this.setAccelerationSettings(100)
    // this.setSampleSettings(3, 1, 1)

    // this.badCommand()
  }
  async handleData(raw) {
    try {
      const { pad, type, id, time, ...data } = JSON.parse(raw)
      if (type === 'HELLO') return
      const response = responses[type]
      if (this[response]) {
        console.log(`response: ${type}`, data)
        this[response](data)
      } else console.log(`unknown type ${type}`, data)
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

  setTimeResponse(data) {}

  shutdownResponse(data) {}
  resetResponse(data) {}

  commitSettingsResponse(data) {}
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
  setIPSettingsResponse(data) {
    this.getIPSettings()
  }
  setPressureSettingsResponse(data) {}
  setAccelerationSettingsResponse(data) {}
  setSampleSettingsResponse(data) {
    this.getSampleSettings()
  }

  badCommandResponse(data) {}
}

module.exports = Device

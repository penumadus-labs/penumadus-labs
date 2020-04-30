const { requests, responses } = require('./tcp-protocol')

class Device {
  constructor(socket) {
    this.socket = socket
    this.online = null
    this.ipSettings = {}
    this.sampleSettings = {}
    this.pressureSettings = {}
    this.accelerationSettings = {}

    socket.on('data', this.handleData.bind(this))

    const requestsKeys = Object.keys(requests)

    requests.forEacb(key => {
      this[key] = function(...args) {
        this.write(key, ...args)
      }
    })

    this.getIP()
    this.getSampleSettings()
    this.getPressureSettings()
    this.getAccelerationSettings()
  }
  async handleData(raw) {
    try {
      const data = JSON.parse(raw)
      // create method name
      const response = responses[data.type]
      delete data.type
      delete data.pad
      delete data.id
      if (!this[response]) console.log(`unknown type ${type}`)
      else this[response](data)
    } catch (error) {
      console.error(error)
    }
  }

  write(requestName, ...args) {
    socket.write(requests[requestName](...args))
  }

  handleStatus() {}
  standardDataResponse(data) {}
  accelerationDataResponse(data) {}
  logDataResponse(data) {}
  shutdownResponse(data) {}
  commitResponse(data) {}
  eraseBufferedDataResponse(data) {}
  getIPSettingsResponse(data) {
    this.ipSettings = data
  }
  setIPSettingsResponse(data) {}
  getPressureSettingsResponse(data) {
    this.pressureSettings = data
  }
  setPressureSettingsResponse(data) {}
  getSampleSettingsResponse(data) {
    this.sampleSettings = data
  }
  setSampleSettingsResponse(data) {}
  getAccelerationSettingsResponse(data) {
    this.accelerationSettings = data
  }
  setAccelerationSettingsResponse(data) {}
}

module.exports = Device

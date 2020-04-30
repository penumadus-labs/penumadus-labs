const {responses, methods} = require('./tcp-protocol')

class Device {
  constructor(socket) {
    this.socket = socket
    this.online = null
    this.ip = {}
    this.sampleSettings = {}
    this.pressureSettings = {}
    this.accelerationSettings = {}

    socket.on('data', this.handleData.bind(this))

    this.getIp()
    this.getSampleSettings()
    this.getPressureSettings()
    this.getAccelerationSettings()
  }
  async handleData(raw) {
    try {
      const data = JSON.parse(raw)
      const { type } = data
      delete data.type
      delete data.pad
      // console.log(`type: ${type}`)
      switch (type) {
        case responses.standardData:
          this.handleStandardData(data)
          break
        case responses.accelerationData:
          this.handleAccelerationData(data)
          break
        case responses.logData:
          this.handleLogData(data)
          break
        // set time
        // shut down
        case 'COMMITPARAMS':
          this.handleCommit(data)
          break
        case 'ERASED':
          this.handleErase(data)
          break
        case 'GETIPPARAMS':
          this.handleGetIp(data)
          break
        // set ip
        case 'GETPRESS':
          this.handleGetPressureSettings(data)
          break
        // set press
        case 'GETSAMP':
          this.handleGetSampleSettings(data)
          break
        // set sample
        case 'ACCELPARAMS':
          this.handleGetAccelerationSettings(data)
          break
        case 'SETACCELPARAMS':
          this.handleSetAccelerationSettings(data)
          break
        case 'HELLO':
          break
        default:
          console.log(`uknown type ${type}`)
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  write(message) {
    const padded = message.padEnd(200)

    console.log(`sent ${message}`)

    this.socket.write(padded)
  }

  handleStatus() {}

  handleStandardData() {}
  handleAccelerationData() {}
  handleLogData() {}

  setTime(seconds, useconds) {
    this.write('')
  }

  shutdown() {
    this.write('')
  }
  handleShutdown() {}

  commit() {}
  handleCommit() {}

  eraseSDCard() {}
  handleErase() {}

  getIp() {
    this.write('GETIP')
  }
  handleGetIp(data) {
    this.ip = data
  }

  setIp() {}
  handleSetIp() {}

  getPressureSettings() {
    this.write('GETPRESS')
  }
  handleGetPressureSettings(data) {
    this.pressureSettings = data
  }

  setPressureSettings() {}
  handleSetPressureSettings() {}

  getSampleSettings() {
    this.write('GETSAMPLEPARAMS')
  }
  handleGetSampleSettings(data) {
    this.sampleSettings = data
  }

  setSampleSettings() {}
  handleSetSampleSettings() {}

  getAccelerationSettings() {
    this.write('GETACCELPARAMS')
  }
  handleGetAccelerationSettings(data) {
    this.accelerationSettings = data
  }

  setAccelerationSettings() {}
  handleSetAccelerationSettings() {}
}

module.exports = Device

// class Device {
//   constructor() {
//     this.ip = ''
//     this.sampleSettings = {}
//     this.pressureSettings = {}
//     this.accelerationSettings = {}
//   }
//   setTime() {},
//   eraseSDCard() {},
//   commit() {},
//   shutdown() {},
//   getIp() {},
//   setIp() {},
//   getPressureSettings() {},
//   setPressureSettings() {},
//   getSampleSettings() {},
//   setSampleSettings() {},
// }

// const device = {
//   ip: '',
//   sample_settings: {},
//   pressure_settings: {},
//   accelleration_settings: {},
//   setTime() {},
//   eraseSDCard() {},
//   commit() {},
//   shutdown() {},
//   getIp() {},
//   setIp() {},
//   getPressureSettings() {},
//   setPressureSettings() {},
//   getSampleSettings() {},
//   setSampleSettings() {},
// }

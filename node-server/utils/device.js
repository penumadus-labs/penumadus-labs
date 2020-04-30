class Device {
  constructor(socket) {
    this.socket = socket
    this.online = null
    this.ip = ''
    this.sampleSettings = {}
    this.pressureSettings = {}
    this.accelerationSettings = {}

    socket.on('data', this.handleData.bind(this))
  }
  async handleData(raw) {
    try {
      const data = JSON.parse(raw)
      const { type } = data
      console.log(type)
      delete doc.type
      delete doc.pad
      switch (type) {
        case 'D':
          this.handleStandardData(data)
          break
        case 'A':
          this.handleAccelerationData(data)
          break
        case 'L':
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
        case 'GETIP':
          this.handleGetIp(data)
          break
        // set ip
        case 'GETPRESS':
          this.handleGetPressureSettings(data)
          break
        // set press
        case 'GETSAMPLE':
          this.handleGetSampleSettings(data)
          break
        // set sample
        case 'GETACCELPARAMS':
          this.handleGetAccelerationSettings(data)
          break
        case 'SETACCELPARAMS':
          this.handleSetAccelerationSettings(data)
          break
        default:
          console.log(`uknown type ${type}`)
          break
      }
    } catch (error) {}
  }

  write(message) {
    this.socket.write(message.padEnd(200))
  }

  handleStatus() {}

  handleStandardData() {}
  handleAccelerationData() {}
  handleLogData() {}

  setTime() {}

  shutdown() {}
  handleShutdown() {}

  commit() {}
  handleCommit() {}

  eraseSDCard() {}
  handleErase() {}

  getIp() {
    this.write('GETIP')
  }
  handleGetIp(data) {
    console.log(data)
  }

  setIp() {}
  handleSetIp() {}

  getPressureSettings() {}
  handleGetPressureSettings() {}

  setPressureSettings() {}
  handleSetPressureSettings() {}

  getSampleSettings() {}
  handleGetSampleSettings() {}

  setSampleSettings() {}
  handleSetSampleSettings() {}

  getAccelerationSettings() {}
  handleGetAccelerationSettings() {}

  setAccelerationSettings() {}
  handleSetAccelerationSettings() {}
}

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

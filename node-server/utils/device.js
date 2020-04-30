class Device {
  constructor(socket) {
    this.socket = socket
    this.ip = ''
    this.sampleSettings = {}
    this.pressureSettings = {}
    this.accelerationSettings = {}

    socket.on('data', this.handleData.bind(this))
  }
  async handleData(data) {
    try {
      const doc = JSON.parse(data)
      const { type } = doc
      delete doc.type
      delete doc.pad
      switch (type) {
        case '':
          break
        case '':
          break
        case '':
          break
        case '':
          break
        case '':
          break
        case '':
          break
        case '':
          break
      
        default:
          break
      }
    } catch (error) {
      
    }
  },
  setTime() {},
  eraseSDCard() {},
  commit() {},
  shutdown() {},
  getIp() {},
  setIp() {},
  getPressureSettings() {},
  setPressureSettings() {},
  getSampleSettings() {},
  setSampleSettings() {},
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
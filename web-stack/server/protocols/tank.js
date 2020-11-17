const messages = {
  ip: {
    address: null,
    port: null,
  },
  pressure: {
    psiPreFill: null,
    psiPostFill: null,
    fill: null,
    fillMax: null,
    fullScale: null,
    excitation: null,
    calcFactor: null,
  },
  acceleration: {
    magnitude: null,
  },
  sample: {
    secondsBetween: null,
    pressureSampleInterval: null,
    accelerationSampleInterval: null,
  },
}

const events = (module.exports = {
  configurable: true,
  streams: [
    { name: 'environmental', command: 'D' },
    { name: 'acceleration', command: 'A' },
  ],
  commands: [
    { name: 'setTime', command: 'TIME' },
    { name: 'eraseBufferedData', command: 'ERASESD' },
    { name: 'commitSettings', command: 'COMMITPARAMS' },
    { name: 'reset', command: 'RESETDEVICE' },
    { name: 'shutdown', command: 'SHUTDOWN' },
  ],
  getters: [
    {
      name: 'getIPSettings',
      command: 'GETIP',
      message: messages.ip,
      label: 'ip',
    },
    {
      name: 'getPressureSettings',
      command: 'GETPRESS',
      message: messages.pressure,
      label: 'pressure',
    },
    {
      name: 'getAccelerationSettings',
      command: 'GETACCELPARAMS',
      message: messages.acceleration,
      label: 'acceleration',
    },
    {
      name: 'getSampleSettings',
      command: 'GETSAMPLEPARAMS',
      message: messages.sample,
      label: 'sample',
    },
  ],
  setters: [
    {
      name: 'setIPSettings',
      command: 'SETIP',
      args: 2,
      message: messages.ip,
      label: 'ip',
    },
    {
      name: 'setPressureSettings',
      command: 'SETPRESS',
      args: 7,
      message: messages.pressure,
      label: 'pressure',
    },
    {
      name: 'setAccelerationSettings',
      command: 'SETACCELPARAMS',
      args: 1,
      message: messages.acceleration,
      label: 'acceleration',
    },
    {
      name: 'setSampleSettings',
      command: 'SETSAMPLEPARAMS',
      args: 3,
      message: messages.sample,
      label: 'sample',
    },
  ],
  // errors: [
  //   {
  //     name: 'badCommand',
  //     command: 'BADCMND',
  //   },
  // ],
})

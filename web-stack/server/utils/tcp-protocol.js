// const dummySettings = {
//   ip: { ipaddr: '18.222.29.175', ipport: '32159' },
//   pressure: {
//     psiPreFill: '30',
//     psiPostFill: '40',
//     fills: '0',
//     fillMax: '20',
//     fullscale: '100.00',
//     excitation: '5.00',
//     calFactor: '3.00',
//   },
//   acceleration: { accelmagthresh: '3.500000' },
//   sample: {
//     secBetween: '10',
//     sampleinterval: '50',
//     accelsampint: '5',
//   },
// }

const config = {
  packetSize: 200,
}

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

const events = {
  streams: [
    { name: 'standardData', command: 'D' },
    { name: 'accelerationData', command: 'A' },
    { name: 'logData', command: 'L' },
  ],
  commands: [
    { name: 'setTime', command: 'TIME' },
    { name: 'eraseBufferedData', command: 'ERASESD' },
    { name: 'commitSettings', command: 'COMMITPARAMS' },
    { name: 'reset', command: 'RESETDEVICE' },
    { name: 'shutdown', command: 'SHUTDOWN' },
  ],
  getters: [
    { name: 'getIPSettings', command: 'GETIP', dataLabel: 'ip' },
    {
      name: 'getPressureSettings',
      command: 'GETPRESS',
      dataLabel: 'pressure',
    },
    {
      name: 'getAccelerationSettings',
      command: 'GETACCELPARAMS',
      dataLabel: 'acceleration',
    },
    {
      name: 'getSampleSettings',
      command: 'GETSAMPLEPARAMS',
      dataLabel: 'sample',
    },
  ],
  setters: [
    {
      name: 'setIPSettings',
      command: 'SETIP',
      args: 2,
      message: messages.ip,
      dataLabel: 'ip',
    },
    {
      name: 'setPressureSettings',
      command: 'SETPRESS',
      args: 7,
      message: messages.pressure,
      dataLabel: 'pressure',
    },
    {
      name: 'setAccelerationSettings',
      command: 'SETACCELPARAMS',
      args: 1,
      message: messages.acceleration,
      dataLabel: 'acceleration',
    },
    {
      name: 'setSampleSettings',
      command: 'SETSAMPLEPARAMS',
      args: 3,
      message: messages.sample,
      dataLabel: 'sample',
    },
  ],
  errors: [{ name: 'badCommand', command: 'BADCMND' }],
}

const table = []

for (const event of Object.values(events)) {
  for (const { name, command } of event) {
    table[command] = name
    table[name] = command
  }
}

module.exports = { config, ...events, table }

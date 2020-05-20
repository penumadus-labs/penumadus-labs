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
    pressureSampleIntverval: null,
    accelerationSampleInverval: null,
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
    { name: 'shutdown', command: 'SHUTDOWN' },
    { name: 'reset', command: 'RESETDEVICE' },
    { name: 'commitSettings', command: 'COMMITPARAMS' },
    { name: 'eraseBufferedData', command: 'ERASESD' },
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
      dataLabel: 'ip',
    },
    {
      name: 'setPressureSettings',
      command: 'SETPRESS',
      args: 7,
      dataLabel: 'pressure',
    },
    {
      name: 'setAccelerationSettings',
      command: 'SETACCELPARAMS',
      args: 1,
      dataLabel: 'acceleration',
    },
    {
      name: 'setSampleSettings',
      command: 'SETSAMPLEPARAMS',
      args: 3,
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

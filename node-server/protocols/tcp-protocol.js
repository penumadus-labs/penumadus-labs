const protocol = {
  config: {
    packetSize: 200,
  },
  data: {
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
  },
  streams: {
    standardData: { command: 'D' },
    accelerationData: { command: 'A' },
    logData: { command: 'L' },
  },
  requests: {
    commands: {
      setTime: { command: 'TIME' },

      shutdown: { command: 'SHUTDOWN' },
      reset: { command: 'RESETDEVICE' },

      commitSettings: { command: 'COMMITPARAMS' },
      eraseBufferedData: { command: 'ERASESD' },
    },
    getters: {
      getIPSettings: {
        command: 'GETIP',
        dataLabel: 'ip',
      },
      getPressureSettings: {
        command: 'GETPRESS',
        dataLabel: 'pressure',
      },
      getAccelerationSettings: {
        command: 'GETACCELPARAMS',
        dataLabel: 'acceleration',
      },
      getSampleSettings: {
        command: 'GETSAMPLEPARAMS',
        dataLabel: 'sample',
      },
    },
    setters: {
      // address port
      setIPSettings: {
        command: 'SETIP',
        args: 2,
        dataLabel: 'ip',
      },
      // psiPreFill(%d) psiPostFill(%d) fill(%d) fillMax(%d) fullScale(%f) excitation(%f) calFactor(%f)
      setPressureSettings: {
        command: 'SETPRESS',
        args: 7,
        dataLabel: 'pressure',
      },
      // mag(%f)
      setAccelerationSettings: {
        command: 'SETACCELPARAMS',
        args: 1,
        dataLabel: 'acceleration',
      },
      // secBetween(%d) sampleinterval(%d) accelsampint(%d)
      setSampleSettings: {
        command: 'SETSAMPLEPARAMS',
        args: 3,
        dataLabel: 'sample',
      },
    },
    errors: {
      badCommand: { command: 'BADCMND' },
    },
  },
}

const streams = Object.entries(protocol.streams)

const commands = Object.entries(protocol.requests.commands)
const getters = Object.entries(protocol.requests.getters)
const setters = Object.entries(protocol.requests.setters)
const errors = Object.entries(protocol.requests.errors)

const all = [...streams, ...commands, ...getters, ...setters, ...errors]

const table = {}

for (const [name, { command }] of all) {
  table[name] = command
  table[command] = name
}

const entries = {
  streams,
  commands,
  getters,
  setters,
  errors,
  table,
}

module.exports = { config: protocol.config, ...entries }

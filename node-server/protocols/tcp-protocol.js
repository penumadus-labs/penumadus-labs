const protocol = {
  config: {
    packetSize: 200,
  },
  streams: {
    standardData: { command: 'D' },
    accelerationData: { command: 'A' },
    logData: { command: 'L' },
  },
  requests: {
    commands: {
      setTime: { command: 'TIME', args: 0 },

      shutdown: { command: 'SHUTDOWN', args: 0 },
      reset: { command: 'RESETDEVICE', args: 0 },

      commitSettings: { command: 'COMMITPARAMS', args: 0 },
      eraseBufferedData: { command: 'ERASESD', args: 0 },
    },
    getters: {
      getIPSettings: { command: 'GETIP', args: 0 },
      getPressureSettings: { command: 'GETPRESS', args: 0 },
      getAccelerationSettings: { command: 'GETACCELPARAMS', args: 0 },
      getSampleSettings: { command: 'GETSAMPLEPARAMS', args: 0 },
    },
    setters: {
      // address port
      setIPSettings: { command: 'SETIP', args: 2 },
      // psiPreFill(%d) psiPostFill(%d) fill(%d) fillMax(%d) fullScale(%f) excitation(%f) calFactor(%f)
      setPressureSettings: { command: 'SETPRESS', args: 7 },
      // mag(%f)
      setAccelerationSettings: { command: 'SETACCELPARAMS', args: 1 },
      // secBetween(%d) sampleinterval(%d) accelsampint(%d)
      setSampleSettings: { command: 'SETSAMPLEPARAMS', args: 3 },
    },
    errors: {
      badCommand: { command: 'BADCMND', args: 0 },
    },
  },
}

const streams = Object.entries(protocol.streams)

const commands = Object.entries(protocol.requests.commands)
const getters = Object.entries(protocol.requests.getters)
const setters = Object.entries(protocol.requests.setters)
const errors = Object.entries(protocol.requests.errors)

const requests = [...commands, ...getters, ...setters, ...errors]
const all = [...streams, ...requests]

const entries = {
  streams,
  commands,
  getters,
  setters,
  errors,
  requests,
  all,
}

module.exports = { config: protocol.config, ...entries }

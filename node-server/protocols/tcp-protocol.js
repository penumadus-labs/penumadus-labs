const protocol = {
  standardData: { command: 'D' },
  accelerationData: { command: 'A' },
  logData: { command: 'L' },

  setTime: { command: 'TIME', args: 0 },

  shutdown: { command: 'SHUTDOWN', args: 0 },
  reset: { command: 'RESETDEVICE', args: 0 },

  commitSettings: { command: 'COMMITPARAMS', args: 0 },
  eraseBufferedData: { command: 'ERASESD', args: 0 },

  getIPSettings: { command: 'GETIP', args: 0 },
  // address port
  setIPSettings: { command: 'SETIP', args: 2 },

  getPressureSettings: { command: 'GETPRESS', args: 0 },
  // psiPreFill(%d) psiPostFill(%d) fill(%d) fillMax(%d) fullScale(%f) excitation(%f) calFactor(%f)
  setPressureSettings: { command: 'SETPRESS', args: 7 },

  getAccelerationSettings: { command: 'GETACCELPARAMS', args: 0 },
  // mag(%f)
  setAccelerationSettings: { command: 'SETACCELPARAMS', args: 1 },

  getSampleSettings: { command: 'GETSAMPLEPARAMS', args: 0 },
  // secBetween(%d) sampleinterval(%d) accelsampint(%d)
  setSampleSettings: { command: 'SETSAMPLEPARAMS', args: 3 },

  badCommand: { command: 'BADCMND', args: 0 },
}

const protocolEntries = Object.entries(protocol)

const requests = protocolEntries.reduce(
  (acc, [name, { command, args: requestArgs }]) => {
    acc[name] = (...args) => {
      if (requestArgs !== args.length)
        throw new Error(
          `expected ${requestArgs} args. recieved ${args.length} args`
        )
      return [command, ...args].join(' ').padEnd(200)
    }
    return acc
  },
  {}
)

const responses = protocolEntries.reduce((acc, [name, { command }]) => {
  acc[command] = name + 'Response'
  return acc
}, {})

module.exports = {
  requests,
  responses,
}

const protocol = {
  standardData: {
    response: 'D',
  },
  accelerationData: {
    response: 'A',
  },
  logData: {
    response: 'L',
  },
  setTime: {
    request: { command: 'TIME', args: 0 },
    response: 'SETTIME', // ?
  },
  shutdown: {
    request: { command: 'SHUTDOWN', args: 0 },
    response: 'SHUTDOWN', // ?
  },
  commitSettings: {
    request: { command: 'COMMITPARAMS', args: 0 },
    response: 'COMMITPARAMS',
  },
  eraseBufferedData: {
    request: { command: 'ERASED', args: 0 },
    response: 'ERASESD',
  },
  getIPSettings: {
    request: { command: 'GETIP', args: 0 },
    response: 'GETIP',
  },
  setIPSettings: {
    // address port
    request: { command: 'SETIP', args: 2 },
    response: 'SETIP', // ?
  },
  getPressureSettings: {
    request: { command: 'GETPRESS', args: 0 },
    response: 'GETPRESS',
  },
  setPressureSettings: {
    // psiPreFill(%d) psiPostFill(%d) fill(%d) fillMax(%d) fullScale(%f) excitation(%f) calFactor(%f)
    request: { command: 'SETPRESS', args: 7 },
    response: 'SETPRESS', // ?
  },
  getAccelerationSettings: {
    request: { command: 'GETACCELPARAMS', args: 0 },
    response: 'GETACCELPARAMS',
  },
  setAccelerationSettings: {
    // mag(%f)
    request: { command: 'SETACCELPARAMS', args: 1 },
    response: 'SETACCELPARAMS',
  },
  getSampleSettings: {
    request: { command: 'GETSAMPLEPARAMS', args: 0 },
    response: 'GETSAMPLEPARAMS',
  },
  setSampleSettings: {
    // secBetween(%d) sampleinterval(%d) accelsampint(%d)
    request: { command: 'SETSAMPLEPARAMS', args: 3 },
    response: 'SETSAMPLEPARAMS', // ?
  },
}

const protocolNames = Object.keys(protocol)

const requests = protocolNames.reduce((acc, key) => {
  const { request } = protocol[key]
  acc[key] = (...args) => {
    if (request.args !== args.length)
      throw new Error(
        `expected ${request.args} args. recieved ${args.length} args`
      )
    return [request.command, ...args].join(' ').padEnd(200)
  }
  return acc
}, {})

const responses = protocolNames.reduce((acc, name) => {
  const { response } = protocol[name]
  acc[response] = name + 'Response'
  return acc
}, {})

module.exports = {
  requests,
  responses,
}

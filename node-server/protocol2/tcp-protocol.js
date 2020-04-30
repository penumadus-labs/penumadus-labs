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
    request: { command: 'SETIP', args: 0 },
    response: 'SETIP', // ?
  },
  getPressureSettings: {
    request: { command: 'GETPRESS', args: 0 },
    response: 'GETPRESS',
  },
  setPressureSettings: {
    request: { command: 'SETPRESS', args: 0 },
    response: 'SETPRESS', // ?
  },
  getSampleSettings: {
    request: { command: 'GETSAMPLEPARAMS', args: 0 },
    response: 'GETSAMP',
  },
  setSampleSettings: {
    request: { command: 'SETSAMPLEPARAMS', args: 0 },
    response: 'SETSAMPLEPARAMS', // ?
  },
  getAccelerationSettings: {
    request: { command: 'GETACCELPARAMS', args: 0 },
    response: 'ACCELPARAMS',
  },
  setAccelerationSettings: {
    request: { command: 'SETACCELPARAMS', args: 0 },
    response: 'SETACCELPARAMS',
  },
}

const keys = Object.keys(procotol)

const requests = keys.reduce((acc, key) => {
  const { request } = protocol[key]
  acc[key] = (...args) => {
    if (request.args !== args.length)
      throw new Error(
        `expected ${request.args} args. recieved ${args.length} args`
      )
    return [request.command, ...args].split(' ').padEnd(200)
  }
}, {})

const responses = keys.reduce((acc, key) => {
  const { response } = protocol[key]
  acc[response] = key + 'Response'
  return acc
}, {})

module.exports = {
  requests,
  responses,
}

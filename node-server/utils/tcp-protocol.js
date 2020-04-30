const responses = {
  standardData: 'D',
  accelerationData: 'A',
  logData: 'L',
  setTime: 'SETTIME', // ?
  shutdown: 'SHUTDOWN', // ?
  commitSDCard: 'COMMITPARAMS',
  eraseSDCard: 'ERASESD',
  getIP: 'GETIP',
  setIP: 'SETIP', // ?
  getPressureSettings: 'GETPRESS',
  setPressureSettings: 'SETPRESS', // ?
  getSampleSettings: 'GETSAMP',
  setSampleSettings: 'SETSAMPLEPARAMS', // ?
  getAccelerationSettings: 'ACCELPARAMS',
  setAccelerationSettings: 'SETACCELPARAMS',
}

const requests = {
  setTime: { command: 'TIME', args: 0 },
  shutdown: { command: 'SHUTDOWN', args: 0 },
  commitSDCard: { command: 'COMMITPARAMS', args: 0 },
  eraseSDCard: { command: 'ERASED', args: 0 },
  getIP: { command: 'GETIP', args: 0 },
  setIP: { command: 'SETIP', args: 2 },
  getPressureSettings: { command: 'GETPRESS', args: 0 },
  setPressureSettings: { command: 'SETPRESS', args: 7 },
  getSampleSettings: { command: 'GETSAMPLEPARAMS', args: 0 },
  setSampleSettings: { command: 'SETSAMPLEPARAMS', args: 3 },
  getAccelerationSettings: { command: 'GETACCELPARAMS', args: 0 },
  setAccelerationSettings: { command: 'SETACCELPARAMS', args: 1 },
}

function formatRequest(request, args) {
  if (request.args !== args.length)
    throw new Error(
      `expected ${request.args} args. recieved ${args.length} args`
    )
  return [request.command].concat(args).split(' ').padEnd(200)
}

const methods = {
  // seconds, useconds
  setTime(...args) {
    formatRequest(requests.setTime, args)
  },
  shutdown(...args) {
    formatRequest(requests.shutdown, args)
  },
  commitSDCard(...args) {
    formatRequest(requests.commitSDCard, args)
  },
  eraseSDCard(...args) {
    formatRequest(requests.eraseSDCard, args)
  },
  getIP(...args) {
    formatRequest(requests.getIP, args)
  },
  // address, port
  setIP(...args) {
    formatRequest(requests.setIP, args)
  },
  getPressureSettings(...args) {
    formatRequest(requests.getPressureSettings, args)
  },
  // psiPreFill, psiPostFill, filled, fillMax, fullscale, excitation, calcFactor
  setPressureSettings(...args) {
    formatRequest(requests.setPressureSettings, args)
  },
  getSampleSettings(...args) {
    formatRequest(requests.getSampleSettings, args)
  },
  setSampleSettings(...args) {
    formatRequest(requests.setSampleSettings, args)
  },
  getAccelerationSettings(...args) {
    formatRequest(requests.getAccelerationSettings, args)
  },
  // mag
  setAccelerationSettings(...args) {
    formatRequest(requests.setAccelerationSettings, args)
  },
}

module.exports = {
  requests,
  responses,
  methods,
}

const { connectToServer } = require('./tcp-client')
const { createEnvironmentData, createAccelerationData } = require('./data')

const writeEnvironmentEvent = () =>
  connectToServer(createEnvironmentData, {
    timeBetween: 5000,
    // limit: 40,
  })

const writeAccelerationEvent = () =>
  connectToServer(createAccelerationData, { timeBetween: 50, limit: 40 })

writeEnvironmentEvent()

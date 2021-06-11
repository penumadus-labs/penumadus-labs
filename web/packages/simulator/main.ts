import { connectToServer } from './tcp-client.ts'
import { createEnvironmentData, createAccelerationData } from './data.ts'

connectToServer(createEnvironmentData, {
  timeBetween: 5000,
  // limit: 40,
})

// connectToServer(createAccelerationData, { timeBetween: 50, limit: 40 })

export {}

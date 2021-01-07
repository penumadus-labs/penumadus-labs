const environmentData = {
  id: 'unit_3',
  type: 'D',
  pressure: 50,
  fills: 20,
  temperature: 25,
  humidity: 40,
}

const getRandomValue = () => Math.floor(Math.random() * Math.floor(300)) / 100

const encoder = new TextEncoder()

const createPacket = (data) => {
  const message = JSON.stringify({
    ...data,
    id: 'unit_3',
    time: Date.now() / 1000,
  })
  const pad = 200 - message.length
  return encoder.encode(message + '\n'.repeat(pad))
}

exports.createEnvironmentData = () => createPacket(environmentData)

exports.createAccelerationData = () => {
  const x = getRandomValue()
  const y = getRandomValue()
  const z = getRandomValue()
  const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  return createPacket({
    type: 'A',
    magnitude,
    x,
    y,
    z,
  })
}

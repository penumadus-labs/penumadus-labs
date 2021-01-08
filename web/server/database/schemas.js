const { reduceToObject } = require('@web/utils')

const bridge = {
  configurable: false,
  dataTypes: ['environment', 'deflection', 'acceleration'],
}

const tank = {
  configurable: true,
  dataTypes: ['environment', 'acceleration'],
}

const deviceSchemas = {
  bridge,
  tank,
}

const createDeviceSchema = ({ id, deviceType = 'bridge', udpPort }) => {
  const schema = deviceSchemas[deviceType]
  return {
    id,
    deviceType,
    udpPort,
    ...schema,
    counters: reduceToObject(schema.dataTypes, (value) => ({ [value]: 0 })),
  }
}

module.exports = { createDeviceSchema, deviceSchemas }

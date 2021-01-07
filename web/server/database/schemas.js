// device schemas with keys

// const acceleration = ['magnitude', 'x', 'y', 'z']

// const bridge = {
//   configurable: false,
//   dataFields: {
//     environment: ['temperature', 'humidity', 'sensors'], // count
//     deflection: ['deflection'],
//     acceleration,
//   },
// }

// const tank = {
//   configurable: true,
//   dataFields: {
//     environment: ['temperature', 'humidity', 'pressure'], // fills
//     acceleration,
//   },
// }

const { reduceToObject } = require('@web/utils')

const bridge = {
  configurable: false,
  dataTypes: ['acceleration', 'deflection', 'environment'],
}

const tank = {
  configurable: true,
  dataTypes: ['acceleration', 'environment'],
}

const deviceSchemas = {
  bridge,
  tank,
}

// props { deviceType id updPort }
// const createDeviceSchema = (props) => {
//   const { dataFields } = deviceSchemas[props.deviceType]

//   // initialize fields
//   const fields = {}
//   for (const field of dataFields) fields[field] = []

//   return {
//     ...props,
//     ...dataFields.reduceToObject((field) => ({ [field]: [] })),
//   }
// }

const createDeviceSchema = ({ id, deviceType, udpPort }) => {
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

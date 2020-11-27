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

const sharedDataFields = ['environment', 'acceleration']

const bridge = {
  configurable: false,
  dataFields: [...sharedDataFields, 'deflection'],
}

const tank = {
  configurable: true,
  dataFields: [...sharedDataFields],
}

const deviceSchemas = {
  bridge,
  tank,
}

// props { deviceType id updPort }
const createDeviceSchema = (props) => {
  const { dataFields } = deviceSchemas[props.deviceType]

  // initialize fields
  const fields = {}
  for (const field of dataFields) fields[field] = []

  return {
    ...props,
    ...dataFields.reduceToObject((field) => ({ [field]: [] })),
  }
}

module.exports = { createDeviceSchema, deviceSchemas }

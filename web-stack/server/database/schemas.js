// const device = {
//   dataFields: ['environment', 'acceleration'],
// }

// const bridge = {
//   configurable: false,
//   dataFields: [...device.dataFields, 'deflection'],
// }

// const tank = {
//   configurable: true,
//   dataFields: [...device.dataFields],
// }

const acceleration = ['magnitude', 'x', 'y', 'z']

const bridge = {
  configurable: false,
  dataFields: {
    environment: ['temperature', 'humidity', 'sensors'], // count
    deflection: ['deflection'],
    acceleration,
  },
}

const tank = {
  configurable: true,
  dataFields: {
    environment: ['temperature', 'humidity', 'pressure'], // fills
    acceleration,
  },
}

const schemas = {
  bridge,
  tank,
}

const createDeviceSchema = (props) => {
  const fields = {}

  const { dataFields } = schemas[props.deviceType]

  // this code would store the keys in the database
  // for (const [field, keys] of list) {
  //   dataFields.push(field)
  //   fields[field] = {
  //     keys,
  //     data: [],
  //   }
  // }

  for (const field of Object.keys(dataFields)) {
    fields[field] = []
  }

  // props info
  // props {
  //  id
  //  updPort
  //  deviceType
  // }

  return {
    ...props,
    ...fields,
  }
}

const getDataKeys = ({ deviceType, field }) => ({
  keys: schemas[deviceType].dataFields[field],
})

const addDeviceContext = (deviceType) => {
  const { dataFields, configurable } = schemas[deviceType]

  return {
    configurable,
    dataFields: Object.keys(dataFields),
  }
}

module.exports = { createDeviceSchema, addDeviceContext, getDataKeys }

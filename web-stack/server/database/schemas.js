const device = {
  dataFields: ['environment', 'acceleration'],
}

const bridge = {
  configurable: false,
  dataFields: [...device.dataFields, 'deflection'],
}

const tank = {
  configurable: true,
  dataFields: [...device.dataFields],
}

const schemas = {
  bridge,
  tank,
}

const createDeviceSchema = (props) => {
  const schema = schemas[props.deviceType]
  const fields = {}

  for (const field of schema.dataFields) {
    fields[field] = []
  }

  // props {
  //  id
  //  updPort
  //  deviceType
  // }

  return {
    ...props,
    ...schema,
    ...fields,
  }
}

module.exports = {
  createDeviceSchema,
  schemas,
}

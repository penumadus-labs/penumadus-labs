const tank = (props) => ({
  ...props,
  environment: [],
  acceleration: [],
})

const bridge = (props) => ({
  ...props,
  environment: [],
  deflection: [],
  acceleration: [],
})

const schemaTable = {
  bridge,
  tank,
}

module.exports = (props) => schemaTable[props.deviceType](props)

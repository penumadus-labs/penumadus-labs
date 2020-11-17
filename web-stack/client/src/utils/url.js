const { NODE_ENV, REACT_APP_DEVELOPMENT_PORT } = process.env
const dev = NODE_ENV === 'development'

const port = dev ? `:${REACT_APP_DEVELOPMENT_PORT}` : ''
const protocolPostfix = dev ? '' : 's'

export default `${protocolPostfix}://${window.location.hostname}${port}/`

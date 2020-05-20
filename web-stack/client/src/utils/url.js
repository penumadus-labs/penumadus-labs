const base = `://${window.location.hostname}${process.env.REACT_APP_PORT}/`

const httpURL = 'http' + base

export default httpURL

export const wsURL = 'ws' + base

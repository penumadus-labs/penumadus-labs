const { REACT_APP_NOT_SECURE, NODE_ENV } = process.env

const secure = REACT_APP_NOT_SECURE || NODE_ENV === 'development' ? '' : 's'

const host = `${secure}://${window.location.host}/`

export const websocketUrl = 'ws' + host
export default 'http' + host

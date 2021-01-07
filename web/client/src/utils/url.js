const { REACT_APP_SECURE, NODE_ENV, REACT_APP_MOUNT_PATH } = process.env

const secure =
  REACT_APP_SECURE === 'secure' && NODE_ENV !== 'development' ? 's' : ''

const urlBody = `${secure}://${window.location.host}${REACT_APP_MOUNT_PATH}`

export const websocketUrl = 'ws' + urlBody
export default 'http' + urlBody

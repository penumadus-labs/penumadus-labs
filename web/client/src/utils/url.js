const { NODE_ENV, REACT_APP_MOUNT_PATH } = process.env

const secure = NODE_ENV === 'development' ? '' : 's'

const urlBody = `${secure}://${window.location.host}${REACT_APP_MOUNT_PATH}`

export const websocketUrl = 'ws' + urlBody
export default 'http' + urlBody

import socket from '../../utils/socket'

export const createActions = disptach => ({
  connect() {},
  async recieved(raw) {
    try {
      const data = JSON.parse(await raw.text())
      // const data = raw
      disptach({ type: 'recieved', data: data.status })
    } catch (e) {
      console.error(e)
    }
  },
  getPressure() {
    socket.send('something :(')
  },
  error(error) {
    disptach({ type: 'error', error })
  },
})

export const createActions = disptach => ({
  connect() {},
  async recieved(raw) {
    try {
      const data = await raw.text()
      console.log(`recieved data from socket: ${data}`)
      disptach({ type: 'recieved', data })
    } catch (e) {
      console.error(e)
    }
  },
  error(error) {
    disptach({ type: 'error', error })
  },
})

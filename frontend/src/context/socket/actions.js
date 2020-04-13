export const createActions = disptach => ({
  connect() {},
  async recieved(raw) {
    try {
      const data = await raw.text()
      disptach({ type: 'recieved', data })
    } catch (e) {
      console.error(e)
    }
  },
  error(error) {
    disptach({ type: 'error', error })
  },
})

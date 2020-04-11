export const createActions = disptach => ({
  connect() {},
  recieved(data) {
    disptach({ type: 'recieved', data })
  },
  error(error) {
    disptach({ type: 'error', error })
  },
})

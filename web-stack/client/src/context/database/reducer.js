export const reducer = (state, { type, data, error, ...action }) => {
  switch (type) {
    case 'data':
      return data
    case 'error':
      return {
        error,
      }
    default:
      throw new Error('database reducer recieved invalid action type')
  }
}

export const initialState = {
  loading: true,
}

export { createActions } from './actions'

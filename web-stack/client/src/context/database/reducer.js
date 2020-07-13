export const reducer = (state, { type, data, error, ...action }) => {
  switch (type) {
    case 'standard-data':
      return {
        ...state,
        standard: data,
        loading: false,
      }
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

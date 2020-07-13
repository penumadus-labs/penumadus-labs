export const reducer = (state, { type, standard, error, ...action }) => {
  switch (type) {
    case 'standard-data':
      return {
        ...state,
        standard,
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

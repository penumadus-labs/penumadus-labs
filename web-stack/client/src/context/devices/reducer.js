export const reducer = (state, { type, settings, error, ...action }) => {
  switch (type) {
    case 'settings':
      return settings
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

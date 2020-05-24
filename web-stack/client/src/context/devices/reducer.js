export const reducer = (
  state,
  { type, protocol, settings, error, ...action }
) => {
  switch (type) {
    case 'protocol':
      return {
        ...protocol,
      }

    case 'settings':
      return {
        ...state,
        settings,
        error: null,
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

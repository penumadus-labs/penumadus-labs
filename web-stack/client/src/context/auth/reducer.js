export const reducer = (state, { type, token, user = {}, error }) => {
  switch (type) {
    case 'authorized':
      return {
        loggedIn: true,
        token,
        user,
      }
    case 'unauthorized':
      return {
        loggedIn: false,
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

export const reducer = (state, action) => {
  switch (action.type) {
    case 'recieved':
      return { data: action.data, error: null }
    case 'error':
      return {
        data: null,
        error: action.error.toString(),
      }
    default:
      throw new Error('socket reducer recieved invalid action type')
  }
}

export const initialState = { data: null, error: null }

export { createActions } from './actions'

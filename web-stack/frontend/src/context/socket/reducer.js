export const reducer = (state, action) => {
  switch (action.type) {
    // case 'status-update':
    //   return {
    //     ...state,
    //     status: action.message,
    //     error: null,
    //   }
    case 'message':
      if (typeof action.data !== 'string') throw Error('invalid data recieved')
      return {
        ...state,
        data: action.data,
        error: null,
      }
    case 'error':
      return {
        error: action.error.toString(),
      }
    default:
      throw new Error('socket reducer recieved invalid action type')
  }
}

export const initialState = { error: null }

export { createActions } from './actions'

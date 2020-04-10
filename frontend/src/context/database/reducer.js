import actions from './actions'

export const initialState = {
  selected: {},
  devices: [],
  error: null,
}

export const createActions = actions

export default (state, action) => {
  switch (action.type) {
    case 'get-devices':
      const result = action.devices.map((name, index) => ({
        name,
        settings: action.settings[index],
        data: action.data[index],
      }))

      return {
        ...state,
        selected: result[0],
        devices: result,
        getError: 'get error',
      }
    case 'select-device':
      return {
        ...state,
        selected: state.devices.find(({ name }) => name === action.name),
      }
    case 'update-settings':
      state.selected.settings = action.settings
      return { ...state }
    case 'error':
      return {
        ...state,
        error: action.error,
      }
    default:
      throw new Error()
  }
}

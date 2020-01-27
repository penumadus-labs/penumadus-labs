import actions from './actions'

export const initialState = {
  selected: {},
  devices: [],
}

export const createActions = actions

export default (state, action) => {
  switch (action.type) {
    case 'get-devices':
      const result = action.devices.map((name, index) => ({
        name,
        settings: action.settings[index],
        csv: action.data[index],
      }))

      return {
        ...state,
        selected: result[0],
        devices: result,
      }
    case 'select-device':
      return {
        ...state,
        selected: state.devices.find(({ name }) => name === action.name),
      }
    case 'update-settings':
      state.selected.settings = action.settings
      return { ...state }
    default:
      throw new Error()
  }
}

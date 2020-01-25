import actions from './actions'

const devices = ['device1', 'device2', 'device3']

const settings = {
  value1: { name: 'value1', value: 10, unit: 'a' },
  value2: { name: 'value2', value: 20, unit: 'b' },
  value3: { name: 'value3', value: 30, unit: 'c' },
  value4: { name: 'value4', value: 40, unit: 'd' },
  value5: { name: 'value5', value: 50, unit: 'e' },
  value6: { name: 'value6', value: 60, unit: 'f' },
  value7: { name: 'value7', value: 70, unit: 'g' },
  value8: { name: 'value8', value: 80, unit: 'h' },
}

export const initialState = {
  fetches: 0,
  posts: 0,
  selected: null,
  devices: [],
  data: {},
  settingsList: [
    'value1',
    'value2',
    'value3',
    'value4',
    'value5',
    'value6',
    'value7',
    'value8',
  ],
}

export const createActions = actions

export default (state, action) => {
  switch (action.type) {
    case 'get-devices':
      const data = devices.reduce((acc, name, index) => {
        acc[name] = {
          name,
          csv: action.data[index],
          settings,
        }
        return acc
      }, {})

      return {
        ...state,
        selected: data[devices[0]],
        devices,
        data,
      }
    case 'select-device':
      return {
        ...state,
        selected: state.data[action.name],
      }
    case 'update-settings':
      state.selected.settings = action.settings
      return { ...state }
    default:
      throw new Error()
  }
}

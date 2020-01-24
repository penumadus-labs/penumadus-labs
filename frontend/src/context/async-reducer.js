const devices = ['device1', 'device2', 'device-x']

const settings = {
  value1: 10,
  value2: 20,
  value3: 30,
  value4: 40,
  value5: 50,
  value6: 60,
  value7: 70,
  value8: 80,
}

export const initialState = {
  selected: { name: 'initial' },
  devices: [],
  data: {},
  settings: {},
}

export default (state, action) => {
  switch (action.type) {
    case 'init':
      return state
    case 'get-devices':
      state.devices = devices

      state.data = devices.reduce((acc, name, index) => {
        acc[name] = {
          name,
          csv: csvs[index],
          settings,
        }
        return acc
      }, {})

      state.selected = state.data[devices[0]]
      return state
    case 'set-device':
      if (state.devices.some(name => name === action.name)) {
        state.selected = state.data[action.name]
      }
      return state
    default:
      throw new Error()
  }
}

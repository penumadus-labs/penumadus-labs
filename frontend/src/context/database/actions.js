import { getDevices, getSettings, getData } from '../../utils/api'

/* 
  wrapper around React's default dispatch function returned from useReducer
  to allow async data fetching before updating context
 */

export default disptach => ({
  async getDevices() {
    try {
      const [devices, settings, data] = await Promise.all([
        getDevices(),
        getSettings(),
        getData(),
      ])

      disptach({ type: 'get-devices', devices, settings, data })
    } catch (error) {
      console.error(error)
      disptach({ type: 'error', error: error.toString() })
    }
  },

  async updateSettings(settings) {
    // await axios.post()
    disptach({ type: 'update-settings', settings })
  },
  selectDevice(name) {
    disptach({ type: 'select-device', name })
  },
})

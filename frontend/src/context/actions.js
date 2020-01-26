import { getAll } from '../utils/api'

export default disptach => ({
  async getDevices() {
    const data = await getAll()

    disptach({ type: 'get-devices', data })
  },
  selectDevice(name) {
    disptach({ type: 'select-device', name })
  },
  async updateSettings(settings) {
    // await axios.post()
    disptach({ type: 'update-settings', settings })
  },
})

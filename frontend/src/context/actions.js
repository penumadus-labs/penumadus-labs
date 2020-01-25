import axios from 'axios'
import * as api from '../utils/api'

export default disptach => ({
  async getDevices() {
    const resps = await Promise.all([
      axios.get(api.device1),
      axios.get(api.device2),
      axios.get(api.device3),
    ])

    const data = resps.map(({ data }) => data)

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

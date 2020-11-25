const broadcaster = (module.exports = {
  users: new Set(),
  devices: {},
  updateUsers(id, type, data = null) {
    broadcaster.users.forEach((client) => {
      client.send(JSON.stringify({ id, type, data }))
    })
  },
  sendDeviceCommand({ id, command, data }) {
    return broadcaster.devices[id][command](data)
  },
  getDeviceSettings(id) {
    if (broadcaster.devices[id]) {
      return broadcaster.devices[id].getSettings()
    }
  },
})

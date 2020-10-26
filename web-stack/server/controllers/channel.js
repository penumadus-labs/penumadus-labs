const channel = (module.exports = {
  users: new Set(),
  devices: {},
  updateUsers(type, data = null) {
    channel.users.forEach((client) => {
      client.send(JSON.stringify({ type, data }))
    })
  },
  sendDeviceCommand({ id, command, args }) {
    return channel.devices[id][command](args)
  },
  getDeviceSettings(id) {
    if (channel.devices[id]) {
      return channel.devices[id].getSettings()
    }
  },
})

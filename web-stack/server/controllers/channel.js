const channel = {
  users: new Set(),
  devices: {},
  updateUsers(type, data = null) {
    channel.users.forEach((client) => {
      client.send(JSON.stringify({ type, data }))
    })
  },
  sendDeviceCommand(id, request, args) {
    return channel.devices[id][request](args)
  },
  getDeviceSettings(id) {
    if (channel.devices[id]) {
      return channel.devices[id].getSettings()
    }
  },
}

module.exports = channel

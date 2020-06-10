const controller = {
  users: null,
  devices: {},
  sendDataToUsers(data) {
    controller.users.forEach((client) => client.send(data))
  },
  sendDeviceCommand(id, request, args) {
    return controller.devices[id][request](args)
  },
  getDeviceSettings(id) {
    if (controller.devices[id]) {
      return controller.devices[id].getSettings()
    }
  },
}

module.exports = controller

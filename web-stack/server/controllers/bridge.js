const controller = {
  users: new Set(),
  devices: {},
  updateUsers(type, data = null) {
    controller.users.forEach((client) => client.send({ type, data }))
  },
  sendDeviceCommand(id, request, args) {
    return controller.devices['unit_3'][request](args)
  },
  getDeviceSettings(id) {
    if (controller.devices[id]) {
      return controller.devices[id].getSettings()
    }
  },
}

module.exports = controller

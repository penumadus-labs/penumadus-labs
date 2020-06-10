const controller = {
  users: null,
  devices: {},
  sendDataToUsers(data) {
    controller.users.forEach((client) => client.send(data))
  },
  sendDeviceCommand(id, request, args) {
    console.log(id)
    return controller.devices['unit_3'][request](args)
  },
  getDeviceSettings(id) {
    if (controller.devices[id]) {
      return controller.devices[id].getSettings()
    }
  },
}

module.exports = controller

const controller = {
  users: null,
  devices: new Set(),
  sendDataToUsers(data) {
    this.users.forEach((client) => client.send(data))
  },
  makeTCPRequest(id, request, ...data) {},
}

module.exports = controller

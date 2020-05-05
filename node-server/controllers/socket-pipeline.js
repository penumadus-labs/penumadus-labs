const controller = {
  webClients: null,
  tcpClients: new Set(),
  sendDataToWebClients(data) {
    this.webClients.forEach((client) => client.send(data))
  },
  sendDataToTCPClients(data) {
    this.tcpClients.forEach((client) => client.write(data))
  },
  makeTCPRequest(id, request, ...data) {},
  sendDataToAllClients() {
    this.sendDataToWebClients(data)
    this.sendDataToClients(data)
  },
}

module.exports = controller

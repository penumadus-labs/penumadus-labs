const controller = {
  webClients: null,
  tcpClients: null,
  sendDataToWebClients(data) {
    this.webClients.forEach(client => client.send(data))
  },
  sendDataToTcpClients(data) {
    this.tcpClients.forEach(client => client.write(data))
  },
  sendDataToAllClients() {
    this.sendDataToWebClients(data)
    this.sendDataToClients(data)
  },
}

module.exports = controller

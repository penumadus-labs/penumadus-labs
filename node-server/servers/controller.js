const controller = {
  webClients: null,
  tcpClients: null,
  sendDataToAllWebServerClients(data) {
    this.webClients.forEach(client => client.send(data))
  },
  sendDataToAllTcpServerClients(data) {
    this.tcpClients.forEach(client => client.write(data))
  },
  sendToAllClients() {
    this.sendToAllWebClients(data)
    this.sendToAllClients(data)
  },
}

module.exports = controller

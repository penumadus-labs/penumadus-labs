const controller = {
  servers: new Set(),
  add(server) {
    controller.servers.add(server)
  },
  handleData(data, from) {
    for (const server of controller.servers) {
      if (server !== from) {
        server.sendAll(data)
      }
    }
  },
}

module.exports = controller

const socketIO = require('socket.io')

const createWebSocket = server => {
  const io = socketIO(server)

  console.log('web socket created')

  io.on('connection', webSocket => {
    console.log('ws connection')
    webSocket.emit('data', 'hello client!')

    webSocket.on('message', message => {
      console.log(`recived message "${message}" from browser`)
    })

    webSocket.on('disconnect', () => {})
  })
}

module.exports = createWebSocket

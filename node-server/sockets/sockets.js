const udp = require('dgram')
const buffer = require('buffer')
const express = require('express')
const { createServer } = require('http')
const socketIO = require('socket.io')
const udpPort = 32180

const createWebsocket = expressApp => {
  const server = createServer(expressApp)
  const io = socketIO(server)

  io.on('connection', webSocket => {
    console.log('browser connected')

    const udpSocket = udp.createSocket('udp4', () =>
      console.log('upd socket created')
    )

    udpSocket.on('message', message => {
      console.log(`message recieved "${message}" from udp`)
      webSocket.emit('message', message.toString())
      console.log('udp message sent to browser')
    })

    webSocket.on('message', message => {
      console.log(`recived message "${message}" from browser`)
      udpSocket.send(Buffer.from(message), udpPort, () =>
        console.log('browser message sent to udp')
      )
    })

    webSocket.on('disconnect', () => {
      console.log('browser disconnected')
      udpSocket.close(() => console.log('udp socket closed'))
    })
  })

  return server
}

module.exports = createWebsocket

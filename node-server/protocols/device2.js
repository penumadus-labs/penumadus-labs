const EventEmitter = require('events')

class SocketWrapper extends EventEmitter {}

const socketWrapper = new SocketWrapper()

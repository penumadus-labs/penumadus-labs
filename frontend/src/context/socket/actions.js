import io from 'socket.io-client'
import url from '../../utils/url'

const socket = io(url)

socket.on('connection', () => {
  console.log('connected to socket')
})

socket.on('message', data => {
  console.log(data)
})

export const createActions = disptach => ({
  connect() {},
})

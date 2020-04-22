import { wsURL } from '../../utils/url'

const ctx = {}

const open = () => {
  const socket = (ctx.socket = new WebSocket(wsURL))

  // socket.onopen = () => console.log('connected to socket')

  socket.onmessage = async raw => {
    try {
      const { status } = JSON.parse(raw.text ? await raw.text() : raw)
      ctx.disptach({ type: 'message', data: status })
    } catch (e) {
      console.error(e)
    }
  }

  socket.onerror = error => {
    ctx.disptach({ type: 'error', error })
  }
}

const close = () => {
  ctx.socket.close()
}

const getPressure = () => {
  ctx.socket.send('P')
}

export const createActions = disptach => {
  ctx.disptach = disptach

  return {
    open,
    close,
    getPressure,
  }
}

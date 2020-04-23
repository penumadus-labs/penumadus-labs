import { wsURL } from '../../utils/url'

const ctx = {}

const open = () => {
  const socket = (ctx.socket = new WebSocket(wsURL))

  socket.onopen = () => {
    getPressure()
  }

  socket.onmessage = async ({ data: raw }) => {
    try {
      const { status } = JSON.parse(await raw.text())
      ctx.disptach({ type: 'message', data: status })
    } catch (e) {
      console.error(e)
    }
  }

  socket.onerror = error => {
    ctx.disptach({ type: 'error', error: 'socket could not connect' })
  }
}

const close = () => {
  ctx.socket.close()
}

const getPressure = () => {
  ctx.socket.send('GETPRESS')
}

export const createActions = disptach => {
  ctx.disptach = disptach

  return {
    open,
    close,
    getPressure,
  }
}

import { useEffect } from 'react'
import useApi from '../api'

const { NODE_ENV, REACT_APP_DEVELOPMENT_PORT } = process.env
const dev = NODE_ENV === 'development'

const port = dev ? `:${REACT_APP_DEVELOPMENT_PORT}` : ''
const protocol = dev ? '' : 's'

const url = `ws${protocol}://${window.location.hostname}${port}/`

let tasks = []
let ws = null

export const useSocket = (init) => {
  const [{ device }, { getSettings }] = useApi()
  useEffect(() => {
    if (!init || ws) return
    ws = new WebSocket(url)

    ws.onmessage = ({ data }) => {
      const { id, ...event } = JSON.parse(data)
      if (id !== device.id) return
      if (event.type === 'settings') return getSettings()
      for (const task of tasks) {
        task(event)
      }
    }

    return () => {
      ws.close()
      ws = null
    }
    // eslint-disable-next-line
  }, [init])
}

const useMessage = (task, deps) => {
  useEffect(() => {
    tasks.push(task)
    return () => {
      tasks = tasks.filter((t) => t !== task)
    }
    // eslint-disable-next-line
  }, deps)
}

export default useMessage

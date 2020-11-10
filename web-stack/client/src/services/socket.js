import { useEffect } from 'react'
import useApi from '../api'

const url = `ws://${window.location.hostname}:8080/`

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

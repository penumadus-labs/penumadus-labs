import { useEffect } from 'react'

const url = `ws://${window.location.hostname}:8080/`

let tasks = []
let ws = null

export const useSocket = (init, onMessage = () => {}) => {
  useEffect(() => {
    if (!init || ws) return
    ws = new WebSocket(url)

    ws.onmessage = ({ data }) => {
      const json = JSON.parse(data)
      onMessage()
      for (const task of tasks) {
        task(json)
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

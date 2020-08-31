import { useEffect } from 'react'
import { wsURL } from './url'

let ws
let tasks = []

export const initializeSocket = (token) => {
  ws = new WebSocket(wsURL, token)

  ws.onmessage = ({ data }) => {
    const parsed = JSON.parse(data)
    for (const task of tasks) {
      task(parsed)
    }
  }

  return () => {
    ws.close()
  }
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

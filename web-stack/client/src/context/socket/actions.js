import { useEffect } from 'react'
import { wsURL } from '../../utils/url'

let ws
let tasks = []

const initialize = () => {
  ws = new WebSocket(wsURL)

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

export default initialize

export const useMessage = (task, deps = []) => {
  useEffect(() => {
    tasks.push(task)
    return () => {
      tasks = tasks.filter((t) => t !== task)
    }
    // eslint-disable-next-line
  }, deps)
}

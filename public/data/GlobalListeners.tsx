import { createContext, FC, useContext, useEffect } from 'react'
import { throttle } from '../utils/timeout'

type clickFn = (event?: MouseEvent) => void

type globalClickHook = (fn: clickFn, dep1?: any) => void

let clickEvents: clickFn[] = []

const clickHandler: clickFn = throttle(event => {
  for (const handler of clickEvents) {
    handler(event)
  }
}, 100)

const useGlobalClick: globalClickHook = (fn, dep1) => {
  useEffect(() => {
    clickEvents.push(fn)
    return () => {
      clickEvents.splice(clickEvents.indexOf(fn), 1)
    }
  }, [dep1])
}

type context = { useGlobalClick: globalClickHook }

const value = { useGlobalClick }

const GlobalListenerContext = createContext<context>(value)

export const GlobalListenerProvider: FC<{}> = ({ children }) => {
  useEffect(() => {
    window.onclick = clickHandler
  }, [])
  return (
    <GlobalListenerContext.Provider value={value}>
      {children}
    </GlobalListenerContext.Provider>
  )
}

export const useGlobalListener = () => useContext(GlobalListenerContext)

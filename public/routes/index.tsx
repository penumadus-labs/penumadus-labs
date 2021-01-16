import { createContext, ReactChildren, useContext } from 'react'
import { useData, DataHook } from './data'

const RouteContext = createContext<DataHook | null>(null)

export const RouteProvider = ({ children }: { children: ReactChildren }) => (
  <RouteContext.Provider value={useData()}>{children}</RouteContext.Provider>
)

export default function useRoutes() {
  return useContext(RouteContext)
}

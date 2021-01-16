import { useRouter } from 'next/dist/client/router'
import { createContext, ReactChildren, useContext, useEffect } from 'react'
import { useData, DataHook } from './data'

const RouteContext = createContext<DataHook | null>(null)

export const RouteProvider = ({ children }: { children: ReactChildren }) => {
  const { pathname } = useRouter()
  const [data, setActive] = useData()

  useEffect(() => {
    for (const { path } of data) {
      if (path === pathname) setActive(path)
    }
  }, [pathname])

  return (
    <RouteContext.Provider value={[data, setActive]}>
      {children}
    </RouteContext.Provider>
  )
}

export default function useRoutes() {
  return useContext(RouteContext)
}

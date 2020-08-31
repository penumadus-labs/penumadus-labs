import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
import useApiStore, { initialState } from './use-api-store'
import createApiMethods from './create-api-methods'

export { api } from './api-base'

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const idState = useState(),
    [id] = idState
  const [state, requestAndStore] = useApiStore(initialState)
  const [methods, mount] = useMemo(
    () => createApiMethods({ requestAndStore, idState }),
    // eslint-disable-next-line
    [id]
  )

  useEffect(() => {
    if (id) mount()
  }, [id, mount])

  return (
    <ApiContext.Provider value={[state, ...methods]}>
      {children}
    </ApiContext.Provider>
  )
}

export default () => useContext(ApiContext)

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import createApiMethods from './create-api-methods'
import useApiStore, { initialState } from './use-api-store'

export { api } from './api-base'

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const [id, setId] = useState()
  const [state, requestAndStore] = useApiStore(initialState)
  const [methods, mount] = useMemo(
    () => createApiMethods({ requestAndStore, id, setId }),
    // eslint-disable-next-line
    [id]
  )

  useEffect(() => {
    if (id) mount()
  }, [id, mount])

  return (
    <ApiContext.Provider value={[{ ...state, id }, ...methods]}>
      {children}
    </ApiContext.Provider>
  )
}

export default () => useContext(ApiContext)

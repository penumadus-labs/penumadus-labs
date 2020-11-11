import React, { createContext, useContext, useMemo, useState } from 'react'
import createApiMethods from './api-provider-body'
import useApiStore, { initialState } from './hooks/use-api-store'

// export { api } from './api'

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const [device, setDevice] = useState()
  const [state, requestAndStore] = useApiStore(initialState)
  const methods = useMemo(
    () => createApiMethods({ requestAndStore, device, setDevice }),
    // eslint-disable-next-line
    [device?.id]
  )

  return (
    <ApiContext.Provider value={[{ ...state, device }, ...methods]}>
      {children}
    </ApiContext.Provider>
  )
}

export default () => useContext(ApiContext)

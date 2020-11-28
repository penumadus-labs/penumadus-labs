import React, { createContext, useContext, useMemo, useState } from 'react'
import createApiMethods from './api-provider-body'
import useApiStore, { initialState } from './hooks/use-api-store'

// export { api } from './api'

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const [device, setDevice] = useState()
  const [state, requestAndStore, mutateStore] = useApiStore(initialState)

  const [actions, hooks] = useMemo(
    () =>
      createApiMethods({
        requestAndStore,
        device,
        setDevice,
      }),
    // eslint-disable-next-line
    [device?.id]
  )

  return (
    <ApiContext.Provider
      value={[{ ...state, device }, { ...actions, mutateStore }, hooks]}
    >
      {children}
    </ApiContext.Provider>
  )
}

export default () => useContext(ApiContext)

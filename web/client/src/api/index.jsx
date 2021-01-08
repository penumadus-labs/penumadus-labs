import React, { createContext, useContext, useMemo, useState } from 'react'
import createApiMethods from './api-provider-body'
import useApiStore from './hooks/use-api-store'

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const [device, setDevice] = useState()
  const [state, requestAndStore, mutateStore] = useApiStore()

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

export default function useApi() {
  return useContext(ApiContext)
}

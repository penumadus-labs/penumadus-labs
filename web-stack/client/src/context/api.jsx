import React, { createContext, useContext, useState, useEffect } from 'react'
import { useApiStore, api } from './api-requests'
import useActions from './actions'
import { Loading } from './statuses'

export { api }

const initialStatus = [<Loading />]
const initialState = {
  protocol: initialStatus,
  deviceList: initialStatus,
  standardData: initialStatus,
  accelerationData: initialStatus,
  settings: initialStatus,
}

const ApiContext = createContext()

export const ApiProvider = ({ children }) => {
  const [state, requestAndStore] = useApiStore(initialState)
  const [id, setId] = useState(null)
  const [actions, hooks, effect] = useActions(id, setId, requestAndStore)

  console.log(state.standardData[1])

  useEffect(effect, [id])

  return (
    <ApiContext.Provider value={[state, actions, hooks]}>
      {children}
    </ApiContext.Provider>
  )
}

export default () => useContext(ApiContext)

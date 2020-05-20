import React, { createContext, useEffect } from 'react'
import useAsyncReducer from '../../hooks/use-reducer-with-actions'
import { reducer, initialState, createActions } from './reducer'

const DatabaseContext = createContext()

export const DatabaseProvider = ({ children }) => {
  const [state, actions] = useAsyncReducer(reducer, initialState, createActions)

  useEffect(() => {
    actions.getData()
  }, [actions])

  return (
    <DatabaseContext.Provider value={[state, actions]}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContext

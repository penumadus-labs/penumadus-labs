import React, { createContext, useReducer, useEffect } from 'react'
import reducer, { initialState } from './reducer'
import axios from 'axios'
import * as api from '../utils/api'

const DevicesContext = createContext()

export const Provider = ({ children }) => {
  console.log('context')
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    void (async () => {
      const csv1 = await axios.get(api.device1)
      const csv2 = await axios.get(api.device2)
      const csv3 = await axios.get(api.device3)
      const data = [csv1, csv2, csv3].map(({ data }) => data)

      dispatch({ type: 'get', data })
    })().catch(console.error)
  }, [dispatch, state.fetches])

  useEffect(() => {
    if (state.posts === 0) return
    void (async () => {
      dispatch({ type: 'post' })
    })().catch(console.error)
  }, [dispatch, state.posts])

  return (
    <DevicesContext.Provider value={[state, dispatch]}>
      {children}
    </DevicesContext.Provider>
  )
}

export default DevicesContext

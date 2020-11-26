import React, { useMemo, useState } from 'react'
import { request, parseError } from '../api'
import { ErrorCard, LoadingCard } from '../api-status-components'

// sets intial state of each api call to loading
// to reduce top level updates
export const initialState = [
  'protocol',
  'devices',
  'environment',
  'deflection',
  'acceleration',
  'accelerationEvent',
  'settings',
].reduce((acc, key) => ({ ...acc, [key]: [<LoadingCard />] }), {})

// returns a request that will store the result in the top level state

export default (initialState) => {
  const [state, setState] = useState(initialState)

  console.log(state)

  const ctx = useMemo(() => {
    const store = (key, value) =>
      setState((state) => ({
        ...state,
        [key]: value, // typeof value === 'function' ? value(key[state]) : value,
      }))

    const requestAndStore = async (key, url, params, storeError = false) => {
      try {
        const data = await request(url, params)
        store(key, [null, data])
        return data
      } catch (error) {
        if (storeError) store(key, [<ErrorCard error={parseError(error)} />])
        else throw error
      }
    }

    return [store, requestAndStore]
  }, [])

  return [state, ...ctx]
}

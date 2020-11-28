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

  const ctx = useMemo(() => {
    const mutateStore = (key, mutation) =>
      setState((state) => ({
        ...state,
        [key]: typeof mutation === 'function' ? mutation(state[key]) : mutation,
      }))

    const requestAndStore = async (key, url, params, storeError = false) => {
      try {
        const data = await request(url, params)
        mutateStore(key, [null, data])
        return data
      } catch (error) {
        if (storeError)
          mutateStore(key, [<ErrorCard error={parseError(error)} />])
        else throw error
      }
    }

    return [requestAndStore, mutateStore]
  }, [])

  return [state, ...ctx]
}

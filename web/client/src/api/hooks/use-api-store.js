import React, { useMemo, useState } from 'react'
import { request } from '../api'
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
].reduce((acc, key) => ({ ...acc, [key]: [] }), {})

// returns a request that will store the result in the top level state

export default function useApiStore() {
  const [state, setState] = useState(initialState)

  const ctx = useMemo(() => {
    const mutateStore = (key, mutation) =>
      setState((state) => ({
        ...state,
        [key]: typeof mutation === 'function' ? mutation(state[key]) : mutation,
      }))

    const requestAndStore = async (key, url, params, storeError = false) => {
      try {
        if (storeError) mutateStore(key, [<LoadingCard />])
        const data = await request(url, params)
        mutateStore(key, [null, data])
        return data
      } catch (error) {
        if (storeError)
          mutateStore(key, [<ErrorCard error={error.toString()} />])
        else throw error
      }
    }

    return [requestAndStore, mutateStore]
  }, [])

  return [state, ...ctx]
}

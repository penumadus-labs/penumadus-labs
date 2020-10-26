import React, { useMemo, useState } from 'react'
import { getRequest, parseError } from '../api'
import { ErrorCard, LoadingCard } from '../api-status-components'

// sets intial state of each api call to loading
// to reduce top level updates
export const initialState = [
  'protocol',
  'deviceList',
  'standardData',
  'accelerationEvents',
  'accelerationEvent',
  'settings',
].reduce((acc, key) => ({ ...acc, [key]: [<LoadingCard />] }), {})

// returns a request that will store the result in the top level state

export default (initialState) => {
  const [state, setState] = useState(initialState)

  const requestAndStore = useMemo(() => {
    const store = (key, value) =>
      setState((state) => ({
        ...state,
        [key]: value,
      }))

    return async (key, url, params, storeError = false) => {
      try {
        const data = await getRequest(url, params)
        store(key, [null, data])
        return data
      } catch (error) {
        if (storeError) store(key, [<ErrorCard error={parseError(error)} />])
        else throw error
      }
    }
  }, [])

  return [state, requestAndStore]
}

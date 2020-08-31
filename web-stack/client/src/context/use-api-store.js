import React, { useState, useMemo } from 'react'
import { Loading, ErrorCard } from './api-status-components'
import { getRequest, parseError } from './api-base'

export const initialState = [
  'protocol',
  'deviceList',
  'standardData',
  'accelerationEvents',
  'settings',
].reduce((acc, key) => ({ ...acc, [key]: [<Loading />] }), {})

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

import React, { useState, useMemo } from 'react'
import axios from 'axios'
import { Loading, Error, InlineError } from './statuses'

const baseURL = `${window.location.protocol}//${window.location.hostname}:8080/api/`

export const api = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
})

export const setToken = (token) => {
  api.defaults.headers.token = token
}

export const query = async (url, params) => {
  const { data } = await api.get(url, { params })
  return data
}

const handleError = (error) => error.response?.statusText || error.toString()

export const useApiStore = (initialState) => {
  const [state, setState] = useState(initialState)

  const requestAndStore = useMemo(() => {
    const store = (key, value) =>
      setState((state) => ({
        ...state,
        [key]: value,
      }))
    return async (key, url, params, storeError = false) => {
      try {
        const data = await query(url, params)
        store(key, [null, data])
        return data
      } catch (error) {
        if (storeError) store(key, [<Error error={handleError(error)} />])
        else throw error
      }
    }
  }, [])

  return [state, requestAndStore]
}

export const createRequestHook = (promise) => () => {
  const [state, setState] = useState({})

  const { loading, success, error } = state

  const setLoading = () => {
    setState({ loading: true })
  }
  const setSuccess = () => {
    setState({ success: true })
  }
  const setError = (error) => {
    setState({ error })
  }

  const request = async (...args) => {
    try {
      setLoading()
      await promise(...args)
      setSuccess()
    } catch (error) {
      setError(handleError(error))
    }
  }

  const status = loading ? (
    <Loading />
  ) : success ? (
    <p className="success">success</p>
  ) : error ? (
    <InlineError error={error} />
  ) : null

  return [status, request, state, setError]
}

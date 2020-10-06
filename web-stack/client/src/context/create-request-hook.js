import React, { useEffect, useState } from 'react'
import { parseError } from './api-base'
import { ErrorInline, Loading } from './api-status-components'

export default (method) => {
  let debounce

  const useRequest = () => {
    const [state, setState] = useState({})
    useEffect(() => () => debounce && clearTimeout(debounce), [])

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
        const res = await method(...args)
        setSuccess()
        debounce = setTimeout(() => {
          debounce = null
          setState({})
        }, 3000)
        return res
      } catch (error) {
        setError(parseError(error))
        throw error
      }
    }

    const status = loading ? (
      <Loading />
    ) : success ? (
      <p className="success">success</p>
    ) : error ? (
      <ErrorInline error={error} />
    ) : null

    return [status, request, state, setError]
  }

  return [useRequest, method]
}

import React, { useEffect, useState } from 'react'
import { parseError } from './api-base'
import { ErrorInline, LoadingInline } from './api-status-components'

export default (method) => {
  let timeout

  const useRequest = () => {
    const [state, setState] = useState({})
    useEffect(() => () => timeout && clearTimeout(timeout), [])

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
        timeout = setTimeout(() => {
          timeout = null
          setState({})
        }, 3000)
        return res
      } catch (error) {
        setError(parseError(error))
        throw error
      }
    }

    const status = loading ? (
      <LoadingInline />
    ) : success ? (
      <p className="success">success</p>
    ) : error ? (
      <ErrorInline error={error} />
    ) : null

    return [status, request, state, setError]
  }

  return [useRequest, method]
}

import React, { useState } from 'react'
import { Loading, ErrorInline } from './api-status-components'
import { parseError } from './api-base'

export default (method) => [
  () => {
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
        const res = await method(...args)
        setSuccess()
        return res
      } catch (error) {
        setError(parseError(error))
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
  },
  method,
]

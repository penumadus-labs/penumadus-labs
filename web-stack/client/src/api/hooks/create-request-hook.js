import React, { useEffect, useState } from 'react'
import { parseError } from '../api'
import { ErrorInline, LoadingInline } from '../api-status-components'

// const useTimeout = (ms, callback) => {
//   const [ref, setRef] = useState(null)
//   // eslint-disable-next-line
//   useEffect(() => () => clearTimeout(ref), [])
//   const setTimer = () => {
//     setRef(
//       setTimeout(() => {
//         setRef(null)
//         callback()
//       }, ms)
//     )
//   }
//   return setTimer
// }

export default (method) => {
  let timeout

  const useRequest = ({ clearStatus = true } = {}) => {
    const [state, setState] = useState({})
    useEffect(() => () => setTimeout(timeout), [])

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
        if (clearStatus)
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

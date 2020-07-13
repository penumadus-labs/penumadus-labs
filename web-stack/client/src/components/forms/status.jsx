import React, { useState } from 'react'
import Loading from '../loading'

export const useStatus = () => {
  const [status, setStatus] = useState({})

  const setLoading = (loading = 'Loading...') => {
    setStatus({ loading })
  }
  const setError = (error = 'Error') => {
    setStatus({ error })
  }
  const setSuccess = (success = 'Success') => {
    setStatus({ success })
  }

  return [{ setLoading, setError, setSuccess }, status]
}

export default ({ error, loading, success }) => (
  <>
    {error ? <p className="error">{error}</p> : null}
    {loading ? <Loading /> : null}
    {success ? <p className="success">{success}</p> : null}
  </>
)

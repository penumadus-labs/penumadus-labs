import React, { useState } from 'react'
import Loading from '../components/loading'

const useStatus = () => {
  const [status, setStatus] = useState({})

  const { loading, error, success } = status

  const setLoading = (loading = 'Loading...') => {
    setStatus({ loading })
  }
  const setError = (error = 'Error') => {
    setStatus({ error })
  }
  const setSuccess = (success = 'Success') => {
    setStatus({ success })
  }

  const Status = () => (
    <>
      {error ? <p className="error">{error}</p> : null}
      {loading ? <Loading /> : null}
      {success ? <p className="success">{success}</p> : null}
    </>
  )

  return [{ setLoading, setError, setSuccess }, Status, status]
}

export default useStatus

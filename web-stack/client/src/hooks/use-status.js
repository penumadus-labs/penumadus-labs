import React, { useState } from 'react'

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
      {loading ? <p className="loading">{loading}</p> : null}
      {success ? <p className="success">{success}</p> : null}
    </>
  )

  return [{ setLoading, setError, setSuccess }, Status, status]
}

export default useStatus

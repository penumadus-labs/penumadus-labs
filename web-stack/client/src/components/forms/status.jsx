import React, { useState } from 'react'
import styled from '@emotion/styled'
import Loading from '../loading'

const Status = styled.div`
  height: 1rem;
  text-align: center;
`

export const useStatus = () => {
  const [status, setStatus] = useState({})

  const setLoading = (loading = 'loading...') => {
    setStatus({ loading })
  }
  const setError = (error = 'error') => {
    setStatus({ error })
  }
  const setSuccess = (success = 'success') => {
    setStatus({ success })
  }

  return [{ setLoading, setError, setSuccess }, status]
}

export default ({ error, loading, success }) => (
  <Status>
    {error ? <p className="error">{error}</p> : null}
    {loading ? <Loading /> : null}
    {success ? <p className="success">{success}</p> : null}
  </Status>
)

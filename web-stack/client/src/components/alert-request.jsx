import React from 'react'
import styled from '@emotion/styled'
import Alert from './alert'
import Status, { useStatus } from './status'

const Controls = styled.div`
  text-align: center;
`

export default ({ children, onAccept, isOpen, close }) => {
  if (!isOpen) return null

  const bind = { isOpen, close }

  const [{ setLoading, setError, setSuccess }, status] = useStatus()
  const { success, loading } = status

  if (loading)
    return (
      <Alert {...bind}>
        <div className="center-child">
          <Status {...status} />
        </div>
      </Alert>
    )

  const handleAccept = async () => {
    try {
      setLoading()
      await onAccept()
      setSuccess()
    } catch (error) {
      if (error.response) setError(error.response.statusText)
    }
  }

  const buttons = !success ? (
    <>
      <button className="button button-green" onClick={handleAccept}>
        accept
      </button>
      <button className="button" onClick={close}>
        cancel
      </button>
    </>
  ) : (
    <button className="button button-red" onClick={close}>
      close
    </button>
  )

  const controls = (
    <Controls className="space-children-y">
      <Status {...status} />
      <div className="center-child space-children-x">{buttons}</div>
    </Controls>
  )

  return (
    <Alert {...bind}>
      {children}
      {controls}
    </Alert>
  )
}

export { useAlert } from './alert'

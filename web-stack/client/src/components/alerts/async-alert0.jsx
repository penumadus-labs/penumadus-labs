import React from 'react'
import Alert from './alert'
import Status, { useStatus } from '../forms/status'

export default ({ children, onAccept, ...bind }) => {
  const { isOpen, close } = bind
  if (!isOpen) return null

  const [status, { setLoading, setError, setSuccess }] = useStatus()
  const { success, loading } = status

  if (loading)
    return (
      <Alert {...bind}>
        <Status {...status} />
        <p>please leave this box open while command executes.</p>
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

  return (
    <Alert {...bind}>
      {children}
      <Status {...status} />
      <div className="center-child space-children-x">{buttons}</div>
    </Alert>
  )
}

export { useAlert } from './alert'

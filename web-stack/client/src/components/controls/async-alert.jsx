import React from 'react'
import Alert, { useAlert } from '../alerts/alert'

export default ({ children, useRequest, args, ...bind }) => {
  if (!bind.isOpen) return null

  const [status, request, { loading, success }] = useRequest()

  const button = loading ? null : success ? (
    <button className="button button-red" onClick={bind.close}>
      close
    </button>
  ) : (
    <button className="button button-green" onClick={() => request(...args)}>
      send
    </button>
  )

  return (
    <Alert {...bind}>
      {children}
      {status}
      <div className="center-child">
        <button
          className="button button-green"
          onClick={() => request(...args)}
        >
          send
        </button>
      </div>
    </Alert>
  )
}

export { useAlert }

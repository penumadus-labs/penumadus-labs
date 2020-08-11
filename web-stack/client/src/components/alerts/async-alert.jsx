import React from 'react'
import Alert from './alert'

export default ({ children, useRequest, args, ...bind }) => {
  if (!bind.isOpen) return null

  const [status, request] = useRequest()

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

export { useAlert } from './alert'

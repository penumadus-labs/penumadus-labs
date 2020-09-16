import React from 'react'
import Alert, { useAlert } from '../alerts/alert'

export default ({ children, useRequest, requestArgs, ...bind }) => {
  if (!bind.isOpen) return null

  const [status, request, { loading, success }] = useRequest()

  const buttons = loading ? null : success ? (
    <button className="button button-red" onClick={bind.close}>
      close
    </button>
  ) : (
    <button
      className="button button-green"
      onClick={() => request(...requestArgs)}
    >
      send
    </button>
  )

  return (
    <Alert {...bind}>
      {children}
      {status}
      <div className="center-child">
        {buttons}
        {/* <button
          className="button button-green"
          onClick={() => request(...requestArgs)}
        >
          send
        </button> */}
      </div>
    </Alert>
  )
}

export { useAlert }

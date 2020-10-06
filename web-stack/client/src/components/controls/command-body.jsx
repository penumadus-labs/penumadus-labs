import React from 'react'

export default (useRequest, requestArgs, children = null) => ({ close }) => {
  const [status, request, { loading, success }] = useRequest()

  const buttons = loading ? null : success ? (
    <button className="button button-red" onClick={close}>
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
    <>
      {children}
      {status}
      <div className="center-child">{buttons}</div>
    </>
  )
}

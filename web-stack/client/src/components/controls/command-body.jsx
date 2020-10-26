import React from 'react'

const CommandBody = ({ useCommand, commandArgs, close, children }) => {
  const [status, request, { loading, success }] = useCommand()

  const buttons = loading ? null : success ? (
    <button className="button button-red" onClick={close}>
      close
    </button>
  ) : (
    <button
      className="button button-green"
      onClick={() => request(...commandArgs)}
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

export default (useCommand, commandArgs, children = null) => ({ close }) => (
  <CommandBody {...{ useCommand, commandArgs, close }}>{children}</CommandBody>
)

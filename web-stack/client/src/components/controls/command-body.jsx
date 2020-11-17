import React from 'react'

export default ({
  useCommand,
  name,
  data,
  close,
  children,
  callback = () => {},
}) => {
  const [status, request, { loading, success }] = useCommand()

  const handleSubmit = async () => {
    await request(name, data)
    await callback()
  }

  const buttons = loading ? null : success ? (
    <button className="button button-red" onClick={close}>
      close
    </button>
  ) : (
    <button className="button button-green" onClick={handleSubmit}>
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

// export default (useCommand, commandArgs, children = null) => ({ close }) => (
//   <CommandBody {...{ useCommand, commandArgs, close }}>{children}</CommandBody>
// )

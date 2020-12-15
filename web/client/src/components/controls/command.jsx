import React from 'react'
import Alert from '../alert'

const CommandBody = ({
  close,
  useCommand,
  name,
  data,
  children,
  callback = () => {},
}) => {
  const [status, request, { loading, success }] = useCommand({
    clearStatus: false,
  })

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

export default ({ disabled, children, ...props }) => {
  return (
    <Alert
      tooltip={false}
      buttonText={props.name}
      disabled={disabled}
      render={({ close }) => (
        <CommandBody close={close} {...props}>
          {children}
        </CommandBody>
      )}
    />
  )
}

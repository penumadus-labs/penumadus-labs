import React from 'react'
import Alert, { useAlert } from './alert'

export default ({ name, sendCommand }) => {
  const [isOpen, open, close] = useAlert()

  const handleAccept = async () => {
    await sendCommand(name)
  }

  return (
    <>
      <button className="button" onClick={open}>
        {name}
      </button>
      {isOpen ? <Alert onAccept={handleAccept} onCancel={close} /> : null}
    </>
  )
}

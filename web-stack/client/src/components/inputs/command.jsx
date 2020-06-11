import React from 'react'
import { useAlert } from '../alert'

export default ({ name, sendCommand }) => {
  const [Alert, open, close] = useAlert()

  const handleAccept = async () => {
    await sendCommand(undefined, name)
  }

  return (
    <>
      <button className="button" onClick={open}>
        {name}
      </button>
      <Alert onAccept={handleAccept} onCancel={close} />
    </>
  )
}

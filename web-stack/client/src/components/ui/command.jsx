import React from 'react'
import Alert, { useAlert } from './alert'
import useDevices from '../../context/devices/context'

export default () => {
  const [, { sendCommand }] = useDevices()
  const [isOpen, open, close] = useAlert()

  const handleAccept = async () => {
    await sendCommand()
  }

  return (
    <>
      <button className="button" onClick={open}>
        Command
      </button>
      {isOpen ? <Alert onAccept={handleAccept} onCancel={close} /> : null}
    </>
  )
}

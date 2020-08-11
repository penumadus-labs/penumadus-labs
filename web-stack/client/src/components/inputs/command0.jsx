import React from 'react'
// import { useAlert } from '../alerts/alert-old'
import Alert, { useAlert } from '../alerts/async-alert'

export default ({ name, sendCommand }) => {
  const [open, bind] = useAlert()

  const handleAccept = async () => {
    await sendCommand(undefined, name)
  }

  return (
    <>
      <button className="button" onClick={open}>
        {name}
      </button>
      <Alert onAccept={handleAccept} {...bind} />
    </>
  )
}

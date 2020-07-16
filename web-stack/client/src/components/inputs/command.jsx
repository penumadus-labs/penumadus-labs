import React from 'react'
// import { useAlert } from '../alerts/alert-old'
import Request, { useAlert } from '../alerts/request'

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
      <Request onAccept={handleAccept} {...bind} />
    </>
  )
}

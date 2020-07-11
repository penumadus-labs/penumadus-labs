import React from 'react'
import { useAlert } from '../alert-old'

export default ({ name, sendCommand }) => {
  const [Alert, open] = useAlert()

  const handleAccept = async () => {
    await sendCommand(undefined, name)
  }

  return (
    <>
      <button className="button" onClick={open}>
        {name}
      </button>
      <Alert onAccept={handleAccept} />
    </>
  )
}

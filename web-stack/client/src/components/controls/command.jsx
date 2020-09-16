import React from 'react'
import Alert, { useAlert } from './async-alert'

export default ({ name, useRequest }) => {
  const [open, bind] = useAlert()

  return (
    <>
      <button className="button" onClick={open}>
        {name}
      </button>
      <Alert {...bind} useRequest={useRequest} requestArgs={[name]} />
    </>
  )
}

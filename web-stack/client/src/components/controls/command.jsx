import React from 'react'
import Alert from '../alert'
import commandBody from './command-body'

export default ({ name, useCommand }) => {
  return <Alert buttonText={name} render={commandBody(useCommand, [name])} />
}

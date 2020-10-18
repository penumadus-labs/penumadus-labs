import React from 'react'
import Alert from '../alert'
import commandBody from './command-body'

export default ({ name, useRequest }) => {
  return <Alert icon={name} render={commandBody(useRequest, [name])} />
}

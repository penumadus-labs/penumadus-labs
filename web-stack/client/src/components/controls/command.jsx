import React from 'react'
import Alert from '../alert'
import CommandBody from './command-body'

export default ({ name, useCommand }) => {
  return (
    <Alert
      buttonText={name}
      render={() => <CommandBody {...{ name, useCommand }} />}
    />
  )
}

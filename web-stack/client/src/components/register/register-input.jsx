import { ErrorMessage } from '@hookform/error-message'
import React from 'react'
import Input from '../input'

export default ({ name, register, errors, clearErrors }) => {
  return (
    <>
      <Input
        ref={register({ required: `device ${name} is required` })}
        className="input-inline"
        type="text"
        label={`device ${name}`}
        name={name}
        onChange={() => clearErrors(name)}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red">{message}</p>}
      />
    </>
  )
}

import { ErrorMessage } from '@hookform/error-message'
import React, { forwardRef } from 'react'
import Input from './input'

export default forwardRef(({ name, errors, clearErrors, ...props }, ref) => {
  return (
    <>
      <Input
        ref={ref}
        type="text"
        name={name}
        onChange={() => clearErrors(name)}
        {...props}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red">{message}</p>}
      />
    </>
  )
})

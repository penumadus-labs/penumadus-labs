import React, { forwardRef } from 'react'
import ErrorInput from '../../error-input'

export default forwardRef(
  ({ setValue, errors, clearErrors, name, ...props }, ref) => {
    const handleClick = (e) => {
      e.preventDefault()
      setValue(name, '')
    }

    return (
      <div>
        {/* <label className="label space-children-x-xxs"> */}
        <br />
        <ErrorInput
          ref={ref}
          className="input"
          type="date"
          name={name}
          {...{ errors, clearErrors }}
          {...props}
        />
        {/* {name}: */}
        {/* <input ref={ref} className="input" type="date" name={name} /> */}
        {/* <br /> */}
        {/* </label> */}
        <button className="button-text text-blue" onClick={handleClick}>
          clear
        </button>
      </div>
    )
  }
)

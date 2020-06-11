import React, { forwardRef } from 'react'
import styled from '@emotion/styled'

const Root = styled.label`
  label {
    white-space: nowrap;
  }

  input {
    width: 4rem;
    margin-top: 0;
    margin-left: 3px;
    cursor: text;
    &:focus {
      filter: brightness(90%);
    }
  }
`

export default forwardRef(({ before, ...props }, ref) => {
  return (
    <Root>
      <label>{props.name}</label>
      {before}
      <input className="input" ref={ref} {...props} />
    </Root>
  )
})

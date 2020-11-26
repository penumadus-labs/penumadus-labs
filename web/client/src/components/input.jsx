import styled from '@emotion/styled'
import React, { forwardRef } from 'react'

const Root = styled.label`
  display: block;

  p {
    white-space: nowrap;
  }

  input {
    margin-top: 3px;
    cursor: text;
    &:focus {
      filter: brightness(90%);
    }
  }
`

export default forwardRef(({ label, ...props }, ref) => {
  return (
    <Root className="space-children-y-xs">
      <p>{label ?? props.name}</p>
      <input className="input-inline" {...props} ref={ref} />
    </Root>
  )
})

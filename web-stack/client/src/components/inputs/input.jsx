import React, { forwardRef } from 'react'
import styled from '@emotion/styled'

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

export default forwardRef(({ before, ...props }, ref) => {
  return (
    <Root className="space-children-y-xs">
      <p>{props.name}</p>
      {before}
      <input className="input" ref={ref} {...props} />
    </Root>
  )
})

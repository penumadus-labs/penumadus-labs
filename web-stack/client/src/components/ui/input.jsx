import React, { forwardRef } from 'react'
import styled from '@emotion/styled'

const Root = styled.label`
  display: block;

  input {
    width: 100%;
    margin-top: 3px;
    cursor: text;
    &:focus {
      filter: brightness(90%);
    }
  }
`

export default forwardRef((props, ref) => {
  return (
    <Root className="space-children-y-xs">
      <p>{props.name}</p>
      <input className="button" ref={ref} {...props} />
    </Root>
  )
})

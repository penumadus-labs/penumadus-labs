import React, { forwardRef } from 'react'
import styled from 'styled-components'

const Root = styled.label`
  display: block;

  input {
    ${({
      theme: {
        mixins: { style },
      },
    }) => style}

    width: 100%;

    margin-top: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    outline: none;

    &:focus {
      filter: brightness(80%);
    }
  }
`

export default forwardRef((props, ref) => {
  return (
    <Root>
      {props.name}
      <input ref={ref} {...props} />
    </Root>
  )
})

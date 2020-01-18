import React from 'react'
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

    padding: ${({ theme }) => theme.spacing.xs};
    outline: none;

    :focus {
      filter: brightness(80%);
    }
  }
`

export default props => (
  <Root>
    <input type='text' {...props} />
  </Root>
)

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

export default ({ value, onChange }) => {
  return (
    <Root>
      <input type='text' value={value} onChange={onChange} />
    </Root>
  )
}

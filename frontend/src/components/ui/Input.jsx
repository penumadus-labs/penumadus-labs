import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  margin: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.color.navBackground};

  label {
    display: block;
  }

  input {
    ${({
      theme: {
        mixins: { style },
      },
    }) => style}

    width: 100%;
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.xs};
    outline: none;

    :focus {
      filter: brightness(80%);
    }
  }
`

const Input = props => {
  const { name, value } = props
  return (
    <Root>
      <label>
        {name}: <input type='text' name={name} value={value} {...props} />
      </label>
    </Root>
  )
}

export default Input

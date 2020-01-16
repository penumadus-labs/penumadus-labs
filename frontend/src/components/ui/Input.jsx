import React from 'react'
import styled from 'styled-components'
import Card from '../Card.jsx'

const Root = styled.label`
  display: block;

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
  const { name, value, current, unit } = props
  return (
    <Card>
      <Root>
        <p>{name}</p>
        <p>curruent: {current + unit}</p>
        <input type='text' name={name} value={value} {...props} />
      </Root>
    </Card>
  )
}

export default Input

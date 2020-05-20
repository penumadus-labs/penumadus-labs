import React from 'react'
import styled from 'styled-components'
import Card from './card'

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.red};
`

export default ({ children = 'error' }) => {
  return (
    <Card>
      <ErrorMessage>{children}</ErrorMessage>
    </Card>
  )
}

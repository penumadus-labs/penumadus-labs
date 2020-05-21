import React from 'react'
import styled from 'styled-components'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

export default (props) => {
  return (
    <Root>
      <p>select device:</p>
      <Select {...props} />
    </Root>
  )
}

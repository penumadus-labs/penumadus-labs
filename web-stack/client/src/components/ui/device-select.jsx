import React from 'react'
import styled from '@emotion/styled'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: var(--sm);
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

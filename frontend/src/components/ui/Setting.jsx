import React from 'react'
import styled from 'styled-components'
import Input from './Input.jsx'

const Root = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};

  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.navBackground};

  > * {
    margin-top: ${({ theme }) => theme.spacing.lg};
  }

  .warning {
    color: ${({ theme }) => theme.color.red};
  }
`

export default props => {
  const { current, unit, name, bind, warning } = props
  return (
    <Root>
      <p>{name}</p>
      <p>curruent: {current + unit}</p>
      <Input {...props} {...bind} />
      {warning && <p className='warning'>{warning}</p>}
    </Root>
  )
}

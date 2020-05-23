import React from 'react'
import styled from '@emotion/styled'
import Input from './input'
import Warning from '../warning'

const Root = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacing.sm};
`

const Setting = styled.div`
  ${({ theme }) => theme.mediaQueries.layout} {
    flex-basis: 33%;
  }
  flex: 1 1 20%;

  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.color.navBackground};

  > * {
    margin-top: ${({ theme }) => theme.spacing.lg};
  }
`

export default ({ list }) => (
  <Root>
    {list.map(({ value, current, unit, name, handleChange, warning }) => (
      <Setting key={name}>
        <p>{name}</p>
        <p>curruent: {current + unit}</p>
        <Input value={value} onChange={handleChange} />
        {warning && <Warning>{warning}</Warning>}
      </Setting>
    ))}
  </Root>
)

import React from 'react'
import styled from 'styled-components'
import Card from '../card'
import Input from './input'
import Button from './button'

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

const Warning = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.color.red};
`

export default ({ list, onSubmit, warning }) => (
  <>
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
    <Card>
      <Button onClick={onSubmit}>Apply</Button>
      {warning && <Warning>{warning}</Warning>}
    </Card>
  </>
)

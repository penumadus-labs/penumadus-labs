import React from 'react'
import styled from '@emotion/styled'
import Input from './input'
import Warning from '../warning'

const Root = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: var(--sm);
`

const Setting = styled.div`
  ${({ theme }) => theme.le.layout} {
    flex-basis: 33%;
  }
  flex: 1 1 20%;
`

export default ({ list }) => (
  <Root className='space-children-y spade-children-x'>
    {list.map(({ value, current, unit, name, handleChange, warning }) => (
      <Setting className='card' key={name}>
        <p>{name}</p>
        <p>curruent: {current + unit}</p>
        <Input value={value} onChange={handleChange} />
        {warning && <Warning>{warning}</Warning>}
      </Setting>
    ))}
  </Root>
)

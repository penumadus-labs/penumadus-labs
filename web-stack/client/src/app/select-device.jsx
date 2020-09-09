import styled from '@emotion/styled'
import React from 'react'
import useApi from '../context/api'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: var(--sm);
  }
`

const devices = ['unit_3', 'unit_2', 'unit_1']

export default (props) => {
  const [
    {
      deviceList: [, list],
    },
    { setId },
  ] = useApi()

  if (!list) return null

  return (
    <Root>
      <p>select device:</p>
      <Select options={devices} onSelect={setId} />
    </Root>
  )
}

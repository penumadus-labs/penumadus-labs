import styled from '@emotion/styled'
import React from 'react'
import useApi from '../api/api'
import Select from './select'

const Root = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: var(--sm);
  }
`

export default () => {
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
      <Select options={list} onSelect={setId} />
    </Root>
  )
}

import React from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'
import Error from '../components/error'

import useDatabaseContext from '../hooks/use-database-context'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`

const Status = styled.p`
  padding-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.font.size.link};
`

export default () => {
  const [{ selected, devices, error }, { selectDevice }] = useDatabaseContext()

  if (error) return <Error>{error}</Error>

  return (
    <Root>
      <Menu>
        <DeviceSelect {...{ selected, devices, selectDevice }} />
        <Download />
      </Menu>
      <Status>status: message</Status>
    </Root>
  )
}

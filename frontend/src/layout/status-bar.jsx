import React from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'

import useDatabaseContext from '../hooks/use-database-context'
import { useSocketContextState } from '../hooks/use-socket-context'

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
  const [
    { selected, devices, error: dbError },
    { selectDevice },
  ] = useDatabaseContext()
  const { data, error: socketError } = useSocketContextState()

  return (
    <Root>
      <Menu>
        {dbError ? (
          <p>{dbError}</p>
        ) : (
          <>
            <DeviceSelect {...{ selected, devices, selectDevice }} />
            <Download />
          </>
        )}
      </Menu>
      <Status>device status: {socketError || data}</Status>
    </Root>
  )
}

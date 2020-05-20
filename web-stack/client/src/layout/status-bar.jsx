import React from 'react'
import styled from 'styled-components'
import DeviceSelect from '../components/ui/device-select'
import Download from '../components/ui/download'
import Warning from '../components/warning'

import useDatabaseContext from '../hooks/use-database-context'
import { useDeviceState } from '../hooks/use-device'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`

const Status = styled.p`
  padding-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ error, theme }) => (error ? theme.color.red : 'inherit')};
  font-size: ${({ theme }) => theme.font.size.link};
`

export default () => {
  const [
    { selected, devices, error: dbError },
    { selectDevice },
  ] = useDatabaseContext()
  const { data, error: socketError } = useDeviceState()

  return (
    <Root>
      <Menu>
        {dbError ? (
          <Warning>{dbError}</Warning>
        ) : (
          <>
            <DeviceSelect {...{ selected, devices, selectDevice }} />
            <Download />
          </>
        )}
      </Menu>
      <Status error={socketError}>
        {socketError ? `error: ${socketError}` : `device status: ${data}`}
      </Status>
    </Root>
  )
}

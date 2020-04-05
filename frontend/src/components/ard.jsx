import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  ${({ theme }) => theme.mixins.card}
`

export default ({ children }) => <Root>{children}</Root>

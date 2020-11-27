import styled from '@emotion/styled'
import React from 'react'
import Delete from './controls/delete'
import Download from './controls/download'
import Help from './controls/help'
import Live from './controls/live'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({
  children,
  render,
  downloadProps,
  deleteProps,
  liveProps,
}) => {
  return (
    <>
      <StyledDiv className="space-children-x">
        <Download {...downloadProps} />
        <Delete {...deleteProps} />
        <Live {...liveProps} />
        <Help />
        {children}
      </StyledDiv>
    </>
  )
}

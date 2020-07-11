import React from 'react'
import styled from '@emotion/styled'
import { GoGear } from 'react-icons/go'
import AlertSettings, { useAlert } from '../../alert-settings'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data }) => {
  const [open, bind] = useAlert()

  return (
    <StyledDiv className="space-children-x">
      <button className="button" onClick={open}>
        <GoGear size="20" />
      </button>
      <AlertSettings {...bind} />
    </StyledDiv>
  )
}

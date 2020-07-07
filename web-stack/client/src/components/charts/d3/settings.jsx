import React from 'react'
import styled from '@emotion/styled'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data }) => {
  return (
    <StyledDiv className="space-children-x">
      <label className="inline-label">
        min:
        <input className="input-box" />
      </label>
      <label className="inline-label">
        max:
        <input className="input-box" />
      </label>
    </StyledDiv>
  )
}

import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  position: relative;
  :hover > p {
    opacity: 1;
  }
`

const ToolTip = styled.p`
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
`

export default ({ children, text }) => {
  return (
    <Container>
      {children}
      <ToolTip className="card">{text}</ToolTip>
    </Container>
  )
}

import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  position: relative;
  :hover > p {
    opacity: 1;
  }
`

const ToolTipBody = styled.p`
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
`

export default function ToolTip({ children, text }) {
  return (
    <Container>
      {children}
      <ToolTipBody className="card">{text}</ToolTipBody>
    </Container>
  )
}

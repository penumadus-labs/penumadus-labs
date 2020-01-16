import React from 'react'
import styled from 'styled-components'

const Root = styled.button`
  ${({
    theme: {
      mixins: { clickable, style },
    },
  }) => clickable + style}
  width: 75px;
  height: 40px;
  margin: ${({ theme }) => theme.spacing.sm};
  background: ${({ color }) => color};
`

const Button = ({ color, children, onClick }) => (
  <Root color={color} onClick={onClick}>
    {children}
  </Root>
)

export default Button

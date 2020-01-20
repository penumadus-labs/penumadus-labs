import React from 'react'
import styled from 'styled-components'

const Root = styled.button`
  ${({
    theme: {
      mixins: { clickable, style },
    },
  }) => clickable + style}
  min-width: 75px;
  height: 40px;

  /* margin-left: ${({ theme }) => theme.spacing.sm}; */
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ color, theme }) => theme.color[color]};
`

const Button = ({ color, children, onClick }) => (
  <Root color={color} onClick={onClick}>
    {children}
  </Root>
)

export default Button

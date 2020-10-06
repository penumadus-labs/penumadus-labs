import styled from '@emotion/styled'
import { Link } from '@reach/router'
import React from 'react'

const Root = styled(Link)`
  padding: var(--sm);
  outline: none;
  box-shadow: none;

  svg {
    color: var(--font);
  }

  p {
    text-align: center;
  }
`

export default ({ Icon, label, to, onClick, ...props }) => (
  <Root
    className="center-child clickable-box"
    to={to}
    onClick={onClick}
    {...props}
  >
    <div>
      <Icon size="36" />
      <p>{label}</p>
    </div>
  </Root>
)

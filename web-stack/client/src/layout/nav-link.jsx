import React from 'react'
import { Link } from '@reach/router'
import styled from '@emotion/styled'

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

export default ({ Icon, label, to, onClick }) => (
  <Root className="center-child clickable" to={to} onClick={onClick}>
    <div>
      <Icon size="36" />
      <p>{label}</p>
    </div>
  </Root>
)

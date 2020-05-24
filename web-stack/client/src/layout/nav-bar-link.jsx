import React from 'react'
import { Link } from '@reach/router'
import styled from '@emotion/styled'

const Root = styled(Link)`
  width: var(--nav-size);
  height: var(--nav-size);
  background: var(--card-background);

  svg {
    color: var(--button-background);
  }

  p {
    text-align: center;
  }
`

export default ({ Icon, label, to, onClick }) => (
  <Root className="center-child clickable" to={to} onClick={onClick}>
    <div>
      <Icon size="42" />
      <p>{label}</p>
    </div>
  </Root>
)

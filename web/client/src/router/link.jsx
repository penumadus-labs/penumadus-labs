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
    font-size: 10px;
    text-align: center;
  }
`

export const linkData = {}

export default function RouteLink({ Icon, label, to, onClick, ...props }) {
  return (
    <Root
      className="center-child clickable-box"
      to={`${process.env.REACT_APP_MOUNT_PATH}${to}`}
      onClick={onClick}
      {...props}
    >
      <div>
        <Icon size="36" />
        <p>{label}</p>
      </div>
    </Root>
  )
}

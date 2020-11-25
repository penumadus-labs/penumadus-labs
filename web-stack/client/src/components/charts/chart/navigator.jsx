import styled from '@emotion/styled'
import { Link } from '@reach/router'
import React from 'react'

const StyledLink = styled(Link)`
  padding-left: var(--md);
`

const routes = ['environment', 'acceleration']

export default () => {
  const links = routes.reduce((acc, route) => {
    const path = `/${route}`
    if (path !== window.location.pathname)
      acc.push(
        <StyledLink className="button-text" key={route} to={path}>
          switch to {route} chart
        </StyledLink>
      )
    return acc
  }, [])
  return <div>{links}</div>
}

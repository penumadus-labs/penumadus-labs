import React from 'react'
import { Link } from '@reach/router'
import styled from 'styled-components'
import responsive from '../utils/responsive'

const Root = styled(Link)`
  ${({
    theme: {
      mixins: { centerChild, clickable },
    },
  }) => centerChild + clickable}
  width: ${({ theme }) => theme.layout.navbar.size};
  height: ${({ theme }) => theme.layout.navbar.size};
  background: ${({ theme }) => theme.color.navBackground};

  div {
    svg {
      color: ${({ theme }) => theme.color.icon};
      font-size: 5rem;
    }

    p {
      color: ${({ theme }) => theme.color.font};

      font-size: ${({ theme }) => theme.font.size.link};
      text-align: center;
    }
  }
`

const NavBarLink = ({ Icon, label, theme }) => (
  <Root to={'/admin/' + label.toLowerCase().split(' ').join('-')}>
    <div>
      <Icon size={responsive({ layout: 36, default: 48 })} />
      <p>{label}</p>
    </div>
  </Root>
)

export default NavBarLink

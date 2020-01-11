import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import responsive from '../utils/responsive';

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
    }

    p {
      color: ${({ theme }) => theme.color.font};

      font-size: ${({ theme }) => theme.font.size.link};
      text-align: center;
    }
  }
`;

const NavBarLink = ({ Icon, label, theme }) => (
  <Root
    to={
      '/app/' +
      label
        .toLowerCase()
        .split(' ')
        .join('-')
    }
  >
    <div>
      <Icon size={responsive({ sm: 36, df: 48 })} />
      <p>{label}</p>
    </div>
  </Root>
);

export default NavBarLink;

import React from 'react';
import styled from 'styled-components';

const Root = styled.button`
  ${({
    theme: {
      mixins: { clickable, style },
    },
  }) => clickable + style}
  width: 75px;
  height: 40px;
`;

const Button = ({ color, children }) => <Root color={color}>{children}</Root>;

export default Button;

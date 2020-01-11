import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  input {
    ${({
      theme: {
        mixins: { style },
      },
    }) => style}
    display: block;
    width: 100%;
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing.xs};
    outline: none;

    :focus {
      filter: brightness(80%);
    }
  }
`;

const Input = () => (
  <Root>
    <label htmlFor="input">input:</label>
    <input type="text" name="input" />
  </Root>
);

export default Input;

import React from 'react';
import styled from 'styled-components';
import Card from './Card.jsx';
import Button from './Button.jsx';

const Root = styled.div`
  ${({ theme }) => theme.mixins.centerChild}
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex[0]};
  background: ${({ theme }) => theme.color.background};
  opacity: 0.85;

  main {
    width: 60vw;
    max-width: 650px;
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.color.navBackground};

    p {
      padding: ${({ theme }) => theme.spacing.sm};
    }

    > div {
      text-align: center;
    }
  }
`;

const green = '#388e3c';
const blue = '#3f51b5';
const red = '#c62828';

const Alert = () => (
  <Root>
    <main>
      <p>are these changes okay?</p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis
        culpa, excepturi officia voluptates voluptatibus repellat beatae enim
        tempora molestias. Inventore impedit tenetur quam voluptas delectus
        quisquam alias molestiae nostrum perferendis. Cumque ipsam odit ex iure
        magni laborum quo culpa nulla obcaecati ratione facere, earum rem ab
        deserunt labore esse eum?
      </p>
      <div>
        <Button color={green}>okay</Button>
        <Button>cancel</Button>
      </div>
    </main>
  </Root>
);

export default Alert;

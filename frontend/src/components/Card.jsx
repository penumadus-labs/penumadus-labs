import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: inline-block;

  > p {
    margin: ${({ theme }) => theme.spacing};
  }

  > div {
    display: flex;
    justify-content: space-between;

    /* width: 50%; */
    padding: ${({ theme }) => theme.spacing};

    > div {
      min-width: 150px;
    }

    > p {
      max-width: 200px;
      margin-left: ${({ theme }) => theme.spacing};
    }
  }
`;

const Card = () => (
  <Root>
    <p>Card Heading</p>
    <div>
      <div></div>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit magnam
        praesentium nulla, accusantium incidunt eum rerum amet quaerat possimus?
        Minima.
      </p>
    </div>
  </Root>
);

export default Card;

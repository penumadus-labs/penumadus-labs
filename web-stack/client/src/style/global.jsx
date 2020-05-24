import React from 'react'
import { Global, css } from '@emotion/core'
import { le, gt } from './mediaqueries'
import * as colors from '../utils/colors'

// mixins
const spaceChildrenY = css`
  > *:not(:first-child) {
    margin-top: var(--sm);
  }
`

const spaceChildrenX = css`
  > *:not(:first-child) {
    margin-left: var(--sm);
  }
`

const raised = css`
  padding: var(--sm);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
`

const clickable = css`
  border: 1px solid var(--dark-blue);
  box-shadow: var(--shadow-button);
  cursor: pointer;
  transition: box-shadow 0.2s;

  :hover {
    box-shadow: none;
    filter: brightness(90%);
  }
  :active {
    filter: brightness(80%);
  }
  :focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--purple);
  }
`

// purple #b24c7f
// yellow #BFA33F

const globalStyle = css`
  :root {
    /* layout config */
    --header-size: 75px;
    --nav-size: 75px;

    /* backgrounds */
    --body-background: ${colors.darkBody};
    --card-background: ${colors.darkCard};
    --button-background: ${colors.darkButton};

    /* fonts */

    /* colors */

    --white: ${colors.white};
    --gray: ${colors.gray};
    --red: ${colors.raspberry};
    --green: ${colors.jade};
    --blue: ${colors.steel};
    --dark-blue ${colors.space};
    --purple: ${colors.purple};

    /* sizes */
    --sm: 0.5rem;
    --md: 1rem;
    --lg: 2rem;
    --radius: 0.2rem;

    /* shadow */
    --shadow-button: 0 3px 2px -1px rgb(0, 0, 0, 0.8),
      0 4px 3px 0 rgb(0, 0, 0, 0.6);

    /* 0 6px 4px -1px rgb(70, 130, 180, 0.3); */
    --shadow-card: 0 4px 3px -1px rgb(0, 0, 0, 0.5),
      0 4px 3px -1px rgb(29, 41, 81, 0.5);

    /* z-index */
    --layer1: 1;
  }

  * {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    border-style: solid;
    border-width: 0;
  }

  body {
    height: 100vh;
    margin: 0;
    color: var(--gray);
    font-size: 0.8rem;
    font-family: 'Roboto', sans-serif;

    letter-spacing: 0.03rem;
    background: var(--body-background);
    * {
      margin: 0;
      padding: 0;
    }
  }

  button,
  input {
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    letter-spacing: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ol,
  ul {
    list-style: none;
  }

  svg {
    display: block;
    margin: auto;
  }

  .flex-4 {
    display: flex;
    flex-wrap: wrap;

    > * {
      flex: 0 1 calc(25% - var(--sm) * 3 / 4);

      ${gt.layout} {
        :nth-child(n + 5) {
          margin-top: var(--sm);
        }
        :not(:nth-child(4n - 3)) {
          margin-left: var(--sm);
        }
      }

      ${le.layout} {
        flex-basis: calc(50% - var(--sm) * 1 / 2);
        :nth-child(n + 3) {
          margin-top: var(--sm);
        }
        :not(:nth-child(2n - 1)) {
          margin-left: var(--sm);
        }
      }
    }
  }

  .flex-2 {
    display: flex;

    flex-wrap: wrap;
    justify-content: space-between;

    > * {
      flex: 0 1 calc(50% - var(--sm) * 1 / 2);

      ${gt.layout} {
        :nth-child(n + 3) {
          margin-top: var(--sm);
        }
        :not(:nth-child(2n - 1)) {
          margin-left: var(--sm);
        }
      }

      ${le.layout} {
        flex-basis: 100%;
        :nth-child(n + 1) {
          margin-top: var(--sm);
        }
      }
    }
  }

  .card {
    ${raised}
    ${spaceChildrenY}
      background: var(--card-background);
  }

  .space-children-y {
    ${spaceChildrenY}
  }

  .gt-space-children-y {
    ${gt.layout} {
      ${spaceChildrenY}
    }
  }

  .space-children-x {
    ${spaceChildrenX}
  }

  .center-child {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shadow-button {
    box-shadow: var(--shadow-button);
  }
  .shadow-card {
    box-shadow: var(--shadow-card);
  }

  .clickable {
    ${clickable}
  }

  .button {
    ${raised}
    ${clickable}
    background: var(--button-background);
  }

  .button-green {
    background: var(--green);
  }

  .button-red {
    background: var(--red);
  }

  .fixed {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .loading {
    color: var(--blue);
  }

  .error {
    color: var(--red);
  }

  .success {
    color: var(--green);
  }
`

export default () => <Global styles={globalStyle} />

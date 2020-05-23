import React from 'react'
import { Global, css } from '@emotion/core'

// mixins
const spaceChildrenY = css`
  > *:not(:first-child) {
    margin-top: var(--sm);
  }
`

const raised = css`
  padding: var(--sm);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`

const clickable = css`
  cursor: pointer;

  :hover {
    filter: brightness(90%);
  }
  :active {
    filter: brightness(80%);
  }
`

const globalStyle = css`
  :root {
    /* layout config */
    --header-size: 75px;
    --nav-size: 75px;

    /* backgrounds */
    --body-background: #1e1e1e;
    --card-background: #272727;
    --button-background: #909090;

    /* fonts */
    --font-color: #ddd;

    /* colors */
    --green: #388e3c;
    --blue: #3f51b5;
    --red: #c62828;

    /* sizes */
    --sm: 0.5rem;
    --md: 1rem;
    --lg: 2rem;
    --radius: 0.2rem;

    /* shadow */
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

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
    color: #ddd;
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

  .card {
    ${raised}
    ${spaceChildrenY}
    background: var(--card-background);
  }

  .space-children-y {
    ${spaceChildrenY}
  }

  .space-children-x {
    > *:not(:first-of-type) {
      margin-left: var(--sm);
    }
  }

  .center-child {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shadow {
    box-shadow: var(--shadow);
  }

  .clickable {
    ${clickable}
  }

  .button {
    ${raised}
    ${clickable}
    background: var(--button-background);
  }

  .fixed {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .error {
    color: var(--red);
  }
`

export default () => <Global styles={globalStyle} />

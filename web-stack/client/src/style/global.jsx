import React from 'react'
import { Global, css } from '@emotion/core'
import { le, gt } from './mediaqueries'
import * as colors from '../utils/colors'

// mixins
const grid = css`
  display: grid;
  column-gap: var(--sm);

  row-gap: var(--sm);
`

const spaceChildrenY = css`
  > * + * {
    margin-top: var(--sm);
  }
`

const spaceChildrenYXS = css`
  > * + * {
    margin-top: var(--xs);
  }
`

const spaceChildrenX = css`
  > *:not(:last-child) {
    margin-right: var(--sm);
  }
`

const spaceChildrenXXXS = css`
  > *:not(:last-child) {
    margin-right: var(--xxs);
  }
`

const raised = css`
  padding: var(--sm);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
`

const card = css`
  ${raised}
  background: var(--card-background);
`

const clickable = css`
  cursor: pointer;
  :hover {
    filter: brightness(85%);
  }
  :focus {
    outline: none;
  }
`

const clickableBox = css`
  ${clickable}
  box-shadow: var(--shadow-button);
  transition: box-shadow 0.2s;
  :focus {
    box-shadow: var(--select);
  }
`

const clickableText = css`
  ${clickable}
  background: none;
  transition: color 0.2s;
  :focus {
    color: var(--purple);
  }
`

const globalStyle = css`
  :root {
    /* layout config */
    --header-size: 75px;
    --nav-size: 75px;

    /* backgrounds */
    --body-background: ${colors.body};
    --card-background: ${colors.card};
    --button-background: ${colors.button};
    --font: ${colors.font};

    /* fonts */

    /* colors */
    --white: ${colors.white};
    --red: ${colors.red};
    --orange: ${colors.orange};
    --yellow: ${colors.yellow};
    --green: ${colors.green};
    --blue: ${colors.blue};
    --purple: ${colors.purple};
    --violet: ${colors.violet};
    --dark-blue: ${colors.space};

    /* sizes */
    --xxs: 0.2rem;
    --xs: 0.4rem;
    --sm: 0.6rem;
    --md: 1rem;
    --lg: 1.8rem;
    --radius: 0.2rem;
    --select: 0 0 0 3px var(--purple);

    /* shadow */
    --shadow-button: 0 3px 2px -1px rgb(0, 0, 0, 0.4), 0 4px 10px -1px rgb;

    /* 0 6px 4px -1px rgb(70, 130, 180, 0.3); */
    --shadow-card: 2px 4px 3px -1px rgb(0, 0, 0, 0.5),
      0 4px 3px -1px rgb(29, 41, 81, 0.5);

    /* z-index */
    --layer1: 10;
    --layer2: 20;
    --layer3: 30;
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

  html {
    font-size: 110%;
  }

  body {
    height: 100vh;
    margin: 0;
    color: var(--font);
    font-size: 0.8rem;
    font-family: 'Segoe UI' 'Roboto', sans-serif;

    letter-spacing: 0.04rem;
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

    /* line-height: inherit; */
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

  .raised {
    z-index: var(--layer1);
  }

  .card {
    ${card}
  }

  .card-spaced {
    ${card}
    ${spaceChildrenY}
  }

  .grid-4 {
    ${grid}
    grid-template-columns: repeat(4, 1fr);
    ${le.layout} {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .grid-commands {
    ${grid}
    grid-template-columns: repeat(5, 1fr);
    ${le.layout} {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .grid-2 {
    ${grid}
    grid-template-columns: repeat(2, 1fr);
    ${le.charts} {
      grid-template-columns: 1fr;
    }
  }

  .space-children-y {
    ${spaceChildrenY}
  }

  .gt-space-children-y {
    ${gt.layout} {
      ${spaceChildrenY}
    }
  }

  .space-children-y-xs {
    ${spaceChildrenYXS}
  }

  .space-children-x {
    ${spaceChildrenX}
  }

  .space-children-x-xxs {
    ${spaceChildrenXXXS}
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

  .clickable-box {
    ${clickableBox}
  }

  .button {
    ${raised}
    ${clickableBox}
    padding: var(--xs) var(--sm);
    background: var(--button-background);
  }

  .button-text {
    ${clickableText}
    background: none;
    cursor: pointer;
  }

  .input {
    ${raised}
    ${clickableBox}
    width: 100%;
    padding: var(--xs) var(--sm);
    color: #555;
    background: var(--font);
    cursor: text;
  }

  .input-inline {
    ${raised}
    ${clickableBox}
    height: var(--lg);
    padding: var(--xs) var(--sm);
    color: #555;
    background: var(--font);
    cursor: text;
  }

  .input-box {
    ${raised}
    ${clickableBox}
    width: 2.2rem;
    height: var(--lg);
    padding: var(--xs) var(--sm);
    color: #555;
    background: var(--font);
    cursor: text;
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

  .bar {
    position: sticky;
    top: 0;
    z-index: 10;
    margin: 0 var(--sm);
  }

  .main {
    ${spaceChildrenY}
    padding: var(--sm);
  }
`

export default () => <Global styles={globalStyle} />

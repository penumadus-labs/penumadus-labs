import React from 'react'
import styled from 'styled-components'
import Button from './Button.jsx'

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
`

const green = '#388e3c'
const blue = '#3f51b5'
const red = '#c62828'

const Alert = ({ settings, children, onAccept, onCancel }) => (
  <Root>
    <main>
      {children}
      <div>
        <Button color={green} onClick={onAccept}>
          accept
        </Button>
        <Button onClick={onCancel}>cancel</Button>
      </div>
    </main>
  </Root>
)

export default Alert

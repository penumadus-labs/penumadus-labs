import React from 'react'
import styled from 'styled-components'
import Button from './button'

const Root = styled.div`
  ${({ theme }) => theme.mixins.centerChild}
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex[0]};

  .opaque-cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${({ theme }) => theme.color.background};
    opacity: 0.5;
  }

  main {
    z-index: ${({ theme }) => theme.zIndex[1]};
    width: 60vw;
    max-width: 650px;

    padding: ${({ theme }) => theme.spacing.sm};
    text-align: center;
    background: ${({ theme }) => theme.color.navBackground};

    .content {
      min-height: 400px;
    }

    p {
      padding: ${({ theme }) => theme.spacing.sm};
    }

    button {
      margin-left: ${({ theme }) => theme.spacing.sm};
    }
  }
`

const Alert = ({ settings, children, onAccept, onCancel }) => (
  <Root>
    <div className='opaque-cover' />
    <main>
      <div className='content'>{children}</div>
      <div>
        <Button color='green' onClick={onAccept}>
          accept
        </Button>
        <Button onClick={onCancel}>cancel</Button>
      </div>
    </main>
  </Root>
)

export default Alert

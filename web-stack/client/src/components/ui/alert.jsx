import React from 'react'
import styled from '@emotion/styled'

const Root = styled.div`
  ${({ theme }) => theme.mixins.centerChild}
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex[0]};

  .opaque-cover main {
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

const OpaqueCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${({ theme }) => theme.color.background};
  opacity: 0.5;
`

const Alert = ({ settings, children, onAccept, onCancel }) => (
  <Root>
    <OpaqueCover />
    <main>
      <div className='content'>{children}</div>
      <div>
        <button className='button' color='green' onClick={onAccept}>
          accept
        </button>
        <button className='button' onClick={onCancel}>
          cancel
        </button>
      </div>
    </main>
  </Root>
)

export default Alert

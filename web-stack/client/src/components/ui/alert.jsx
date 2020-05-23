import React from 'react'
import styled from '@emotion/styled'

const Root = styled.div`
  z-index: var(--layer1);
  main {
    z-index: var(--layer1);
    width: 60vw;
    max-width: 650px;
    text-align: center;
  }
`

const OpaqueCover = styled.div`
  background: var(--body-background);
  opacity: 0.5;
`

const Content = styled.div`
  min-height: 400px;
`

const Alert = ({ settings, children, onAccept, onCancel }) => (
  <Root className='center-child fixed'>
    <OpaqueCover className='fixed' />
    <main className='card'>
      <div className='content'>{children}</div>
      <div className='space-children-x'>
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

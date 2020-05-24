import React, { useState } from 'react'
import styled from '@emotion/styled'
import useStatus from '../../hooks/use-status'

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

export default ({ settings, children, onAccept, onCancel }) => {
  const [
    { setLoading, setError, setSuccess },
    Status,
    { success },
  ] = useStatus()

  const handleAccept = async () => {
    try {
      setLoading()
      await onAccept()
      setSuccess()
    } catch (error) {
      if (error.response) setError(error.response.statusText)
    }
  }

  return (
    <Root className='center-child fixed'>
      <OpaqueCover className='fixed' />
      <main className='card'>
        <Content>{children}</Content>
        <Status />
        {!success ? (
          <div className='space-children-x'>
            <button className='button button-green' onClick={handleAccept}>
              Accept
            </button>
            <button className='button' onClick={onCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button className='button button-red' onClick={onCancel}>
            Close
          </button>
        )}
      </main>
    </Root>
  )
}

export const useAlert = () => {
  const [state, setState] = useState(false)

  const open = () => setState(true)
  const close = () => setState(false)

  return [state, open, close]
}

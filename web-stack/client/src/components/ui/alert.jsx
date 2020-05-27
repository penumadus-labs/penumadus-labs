import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import useStatus from '../../hooks/use-status'

const Root = styled.div`
  z-index: var(--layer1);
  main {
    z-index: var(--layer1);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 60vw;
    max-width: 650px;
    min-height: 300px;
    text-align: center;
  }
`

const OpaqueCover = styled.div`
  background: var(--body-background);
  opacity: 0.5;
`

export default ({ settings, children, onAccept, onCancel }) => {
  const [
    { setLoading, setError, setSuccess },
    Status,
    { success },
  ] = useStatus()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

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
    <Root className="center-child fixed">
      <OpaqueCover className="fixed" />
      <main className="card-spaced">
        <div>{children}</div>
        <Status />
        <div className="space-children-x">
          {!success ? (
            <>
              <button className="button button-green" onClick={handleAccept}>
                Accept
              </button>
              <button className="button" onClick={onCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="button button-red" onClick={onCancel}>
              Close
            </button>
          )}
        </div>
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

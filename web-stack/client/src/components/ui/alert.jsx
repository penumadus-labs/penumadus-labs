import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import useStatus from '../../hooks/use-status'

const Root = styled.div`
  z-index: var;

  @keyframes open {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes close {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }

  animation: ${({ animation }) => animation} 0.3s 1 forwards;
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

const Alert = ({
  animation,
  isOpen,
  settings,
  children,
  onAccept,
  onCancel,
}) => {
  const [
    { setLoading, setError, setSuccess },
    Status,
    { success, loading },
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

  if (!isOpen) return null

  const handleAccept = async () => {
    try {
      setLoading()
      await onAccept()
      setSuccess()
    } catch (error) {
      if (error.response) setError(error.response.statusText)
    }
  }

  const body = loading ? null : !success ? (
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
  )

  return (
    <Root animation={animation} className="center-child fixed">
      <OpaqueCover className="fixed" />
      <main className="card-spaced">
        <div>{children}</div>
        <Status />
        <div className="space-children-x">{body}</div>
      </main>
    </Root>
  )
}

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [animation, setAnimation] = useState('open')

  const open = () => {
    setAnimation('open')
    setIsOpen(true)
  }

  const close = () => {
    setAnimation('close')
    setTimeout(() => setIsOpen(false), 300)
  }

  return [
    (props) => <Alert animation={animation} isOpen={isOpen} {...props} />,
    open,
    close,
  ]
}

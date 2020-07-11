import React, { useState } from 'react'
import styled from '@emotion/styled'
import useEsc from '../hooks/use-esc'

/* @keyframes open {
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

  animation: ${({ animation }) => animation} 0.3s 1 forwards; */

const Anchor = styled.div`
  z-index: var(--layer3);
`

const StyledDiv = styled.div`
  width: 60vw;
  max-width: 650px;

  /* min-height: 300px; */
`

const OpaqueCover = styled.div`
  z-index: var(--layer2);
  background: var(--body-background);
  opacity: 0.5;
`

export default ({ children, isOpen, close }) => {
  if (!isOpen) return null

  useEsc(close)

  return (
    <>
      <Anchor className="center-child fixed">
        <StyledDiv className="card-spaced">
          <button className="button-text-red" onClick={close}>
            close
          </button>
          {children}
        </StyledDiv>
      </Anchor>
      <OpaqueCover className="fixed" />
    </>
  )
}

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return [open, { isOpen, close }]
}

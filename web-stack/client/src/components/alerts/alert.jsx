import React, { useState } from 'react'
import styled from '@emotion/styled'
import useEsc from '../../hooks/use-esc'
import { IoMdClose as Close } from 'react-icons/io'

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

const ClickOut = styled.button`
  width: 100%;
  height: 100%;
  opacity: 0;
`

const StyledDiv = styled.div`
  z-index: 50;
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
        <ClickOut className="fixed" onClick={close} />
        <StyledDiv className="card-spaced">
          <button className="button-text" onClick={close}>
            <Close size="20" />
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

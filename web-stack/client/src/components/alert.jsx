import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
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

const CloseButton = styled.button`
  position: absolute;
`

const OpaqueCover = styled.div`
  z-index: var(--layer2);
  background: var(--body-background);
  opacity: 0.5;
`

const Title = styled.p`
  margin-bottom: var(--lg);
  padding: 0;
  font-size: var(--md);
  text-align: center;
`

const Body = styled.div`
  text-align: center;
  > div {
    display: inline-block;
    text-align: initial;
  }
`

export const useEsc = (callback) =>
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) callback()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])

export default ({ children, buttonText, disabled, render, title }) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => {
    if (isOpen) setIsOpen(false)
  }
  useEsc(close)

  return (
    <>
      {isOpen && (
        <>
          <Anchor className="center-child fixed">
            <ClickOut className="fixed" onClick={close} />
            <StyledDiv className="card">
              <CloseButton className="button-text" onClick={close}>
                <Close size="20" />
              </CloseButton>
              {title && <Title className="title">{title}</Title>}
              <Body>
                <div className="space-children-y">
                  {children ?? (render && render({ close }))}
                </div>
              </Body>
            </StyledDiv>
          </Anchor>
          <OpaqueCover className="fixed" />
        </>
      )}
      <button className="button" disabled={disabled} onClick={open}>
        {buttonText}
      </button>
    </>
  )
}

// const useAlert = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const open = () => setIsOpen(true)
//   const close = () => {
//     if (isOpen) setIsOpen(false)
//   }
//   return [open, isOpen, close]
// }

// export const useAlertManual = () => {
//   const [open, isOpen, close] = useAlert()

//   return [
//     ({ children, ...props }) => (
//       <Alert {...{ isOpen, close, ...props }}>{children}</Alert>
//     ),
//     open,
//   ]
// }

// export default ({ children, buttonText, disabled = false, ...props }) => {
//   const [open, isOpen, close] = useAlert()
//   return (
//     <>
//       <button className="button" disabled={disabled} onClick={open}>
//         {buttonText}
//       </button>
//       <Alert {...{ isOpen, close, ...props }}>{children}</Alert>
//     </>
//   )
// }

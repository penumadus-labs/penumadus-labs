import styled from '@emotion/styled'
import React, { useState } from 'react'
import { IoMdClose as Close } from 'react-icons/io'
import { useEsc } from '../hooks/use-events'
import Tooltip from './tooltip'

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

const AlertContainer = styled.div`
  z-index: 50;
  min-width: 40vw;
  max-width: 650px;
  margin: var(--sm);
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
  margin: auto;
  text-align: center;
`

export default function Alert({
  children,
  render,
  title,
  buttonText,
  disabled,
  tooltip = true,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => {
    if (isOpen) setIsOpen(false)
  }
  useEsc(close)

  const button = (
    <button className="button open-alert" disabled={disabled} onClick={open}>
      {buttonText}
    </button>
  )

  return (
    <>
      {isOpen && (
        <>
          <Anchor className="center-child fixed">
            <ClickOut className="fixed" onClick={close} />
            <AlertContainer className="card">
              <CloseButton className="button-text" onClick={close}>
                <Close size="20" />
              </CloseButton>
              {title && <Title className="title">{title}</Title>}
              <Body className="space-children-y">
                {typeof render === 'function' ? render({ close }) : children}
              </Body>
            </AlertContainer>
          </Anchor>
          <OpaqueCover className="fixed" />
        </>
      )}
      {tooltip ? <Tooltip text={title}>{button}</Tooltip> : button}
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

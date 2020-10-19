import styled from '@emotion/styled'
import React from 'react'

const Ellipsis = styled.div`
  position: relative;
  display: block;
  width: 80px;
  height: 26px;
  margin: auto;

  div {
    position: absolute;

    top: 10px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-of-type(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  div:nth-of-type(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-of-type(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  div:nth-of-type(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`

export const LoadingInline = () => {
  return (
    <Ellipsis>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Ellipsis>
  )
}

export const LoadingCard = () => {
  return (
    <div className="card">
      <Ellipsis>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Ellipsis>
    </div>
  )
}

export const ErrorInline = ({ error }) => <p className="error">{error}</p>

export const ErrorCard = ({ error }) => (
  <div className="card">
    <ErrorInline error={error} />
  </div>
)

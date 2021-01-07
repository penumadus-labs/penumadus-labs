import React from 'react'
import Alert from '../alert'
import { AiFillFileImage as Image } from 'react-icons/ai'
import { useResize } from '../../hooks/use-events'

const getHeight = () => window.innerHeight * 0.8

const Body = () => {
  const ref = useResize(({ current }) => {
    current.setAttribute('height', getHeight())
  })

  return (
    <img
      ref={ref}
      src="api/static/sensors.png"
      alt="could not load"
      height={getHeight()}
    />
  )
}

export default function BridgeSensorsInfo() {
  return (
    <Alert title="bridge sensors location" buttonText={<Image size="20" />}>
      <Body />
    </Alert>
  )
}

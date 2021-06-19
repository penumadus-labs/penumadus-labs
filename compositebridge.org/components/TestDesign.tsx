import { FC } from 'react'
import AbsoluteBox from './shapes/AbsoluteBox'
import Line from './shapes/Line'

const line1 = {
  bottom: '-10%',
  right: '10%',
  width: '20%',
  height: '80%',
}

const box1 = {
  width: '40%',
  height: '35%',
  right: '0',
  top: '10%',
}

const box2 = {
  width: '50%',
  bottom: '0',
  height: '20%',
  left: '10%',
}

const box3 = {
  width: '20%',
  bottom: '10%',
  height: '40%',
  right: '10%',
}

export const TestDesign: FC = () => {
  return (
    <>
      <AbsoluteBox css={box1} />
      <AbsoluteBox css={box2} />
      <AbsoluteBox css={box3} />
      <Line css={line1} />
    </>
  )
}

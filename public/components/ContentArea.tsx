import { FC } from 'react'
import { UseAddEvent } from '../routes/events'
import AbsoluteBox from './shapes/AbsoluteBox'
import Box from './shapes/Box'
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

export const ContentArea: FC<{
  title: string
  href: string
  useAddEvent: UseAddEvent
}> = ({ children, title, href, useAddEvent }) => {
  const ref = useAddEvent(href)
  return (
    <>
      <div ref={ref} id={href.slice(2)} className="content-area">
        <Box
          css={{
            height: '16rem',
            width: '100%',
          }}
        />
        <section className="p">
          <div className="hidden-small">
            <h1 className="title">{title}</h1>
          </div>
          {children}
        </section>
        <AbsoluteBox css={box1} />
        <AbsoluteBox css={box2} />
        <AbsoluteBox css={box3} />
        <Line css={line1} />
      </div>
      <style jsx>{`
        .content-area {
          position: relative;
          min-height: 100vh;
          background: white;
          text-align: center;
          overflow: hidden;
        }

        h1 {
          display: inline-block;
          border-bottom: 0.5rem solid var(--orange);
          margin: 0 auto;
          font-size: 3rem;
          margin-top: 2rem;
          margin-bottom: 4rem;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        p {
          padding: 2rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

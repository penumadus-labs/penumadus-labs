import Line from './shapes/Line'
import AbsoluteBox from './shapes/AbsoluteBox'
import Box from './shapes/Box'
import { useEffect, useRef, FC } from 'react'
import { useRoutes } from '../routes'

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
}> = ({ title, href, children }) => {
  const [, addEvent] = useRoutes()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current !== null)
      addEvent(() => [
        href,
        ref.current?.getBoundingClientRect().top ?? Infinity,
      ])
  }, [])
  return (
    <>
      <div ref={ref} id={href.slice(2)} className="content-area">
        <Box
          css={{
            height: '16rem',
            width: '100%',
          }}
        />
        <section>
          <h1 className="hidden-small">{title}</h1>
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

        section {
          padding: 2rem;
        }

        h1 {
          border-bottom: 0.5rem solid var(--orange);
          max-width: 24rem;
          margin: 0 auto;
          font-size: 4rem;
          margin-top: 2rem;
          margin-bottom: 4rem;
        }

        p {
          padding: 2rem;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

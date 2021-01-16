import Line from './shapes/Line'
import AbsoluteBox from './shapes/AbsoluteBox'
import Box from './shapes/Box'
import { useEffect, useRef } from 'react'
import { throttle } from '../utils/timeout'

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

export default function ContentArea({
  title,
  content,
}: {
  title: string
  content: string
  contentWidth?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleScroll = throttle(() => {})

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <>
      <div ref={ref} id={title} className="content-area">
        <Box
          css={{
            height: '16rem',
            width: '100%',
          }}
        />
        <section>
          <h1 className="hidden-small">{title}</h1>
          <p>{content}</p>
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
          padding-top: 4rem;
          border-bottom: 0.5rem solid var(--orange);
          max-width: 24rem;
          margin: 0 auto;
          font-size: 4rem;
        }

        p {
          margin-top: 4rem;
          max-width: 85%;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

import Line from './Line'
import Box from './Box'

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
  contentWidth = '60%',
}: {
  title: string
  content: string
  contentWidth?: string
}) {
  return (
    <>
      <div id={title} className="content-area p cols-2">
        <section>
          <h1>{title}</h1>
          <p>{content}</p>
        </section>
        <div />
        <Box css={box1} />
        <Box css={box2} />
        <Box css={box3} />
        <Line css={line1} />
      </div>
      <style jsx>{`
        .content-area {
          padding-top: 4rem;
          position: relative;
          min-height: 100vh;
          background: white;
          text-align: center;
          margin-top: 2rem;
          margin-bottom: 2rem;
          display: flex;
          overflow: hidden;
        }

        section {
          width: ${contentWidth};
        }

        h1 {
          border-bottom: 10px solid var(--orange);
          width: 400px;
          margin: 0 auto;
          font-size: 4rem;
        }

        p {
          margin-top: 1.75rem;
        }
      `}</style>
    </>
  )
}

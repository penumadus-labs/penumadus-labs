export default function ContentArea({
  title,
  content,
}: {
  title: string
  content: string
}) {
  return (
    <>
      <div id={title} className="content-area p cols-2">
        <div>
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div className="box"></div>
          {/* <div className="anchor">
            <div className="box box1"></div>
            <div className="line"></div>
          </div> */}
        </div>
      </div>
      <style jsx>{`
        .content-area {
          padding-top: 4rem;
          position: relative;
          min-height: 100vh;
          background: white;
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 1rem;
          display: flex;
        }
        h1 {
          border-bottom: 10px solid var(--orange);
          width: 400px;
          margin: 0 auto;
          font-size: 4rem;
        }
        .activator {
          position: absolute;
          top: -10rem;
          padding: 5px;
          background: black;
        }
        p {
          margin-top: 1.75rem;
        }

        .anchor {
          position: relative;
          margin-top: 10rem;
        }

        .box {
          position: absolute;
          background: var(--gray);
          width: 80%;
          height: 300px;
          z-index: 10;
        }

        .box1 {
          top: 350px;
          width: 60%;
        }

        .line {
          position: absolute;
          top: 450px;
          left: -50px;

          transform: rotate(125deg);
          background: var(--orange);
          height: 10px;
          width: 800px;
          z-index: 5;
        }
      `}</style>
    </>
  )
}

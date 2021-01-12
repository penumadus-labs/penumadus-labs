export default function ContentArea({
  title,
  content,
}: {
  title: string
  content: string
}) {
  return (
    <>
      <div id={title} className="anchor content-area"></div>
      <h1>{title}</h1>
      <p>{content}</p>
      <style jsx>{`
        .anchor {
          height: 4rem;
          position: relative;
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
      `}</style>
    </>
  )
}

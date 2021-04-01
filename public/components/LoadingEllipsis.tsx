export default function Loading() {
  return (
    <>
      <p>loading</p>
      <style jsx>{`
        p {
          margin-top: 2rem;
        }

        p:after {
          content: '';
          display: inline-block;
          animation: ellipsis-dot 1.3s infinite 0.3s;
          width: 1.25em;
          text-align: left;
        }

        @keyframes ellipsis-dot {
          0% {
            content: '';
          }
          25% {
            content: '.';
          }
          50% {
            content: '..';
          }
          75% {
            content: '...';
          }
          100% {
            content: '';
          }
        }
      `}</style>
    </>
  )
}

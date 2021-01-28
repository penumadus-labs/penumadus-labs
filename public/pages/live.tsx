export default function Live() {
  const liveVideoUrl = 'https://camera.compositebridge.org/'

  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
        </div>
        <div className="center-items">
          <img
            src={liveVideoUrl}
            alt={liveVideoUrl}
            width="100%"
            height="auto"
          />
        </div>
      </div>
      <style jsx>{`
        .root {
          background: white;
          min-height: 100vh;
          text-align: center;
        }
        img {
          vertical-align: middle;
          margin-top: 2rem;
        }
      `}</style>
    </>
  )
}

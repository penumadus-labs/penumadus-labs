export default function Live() {
  // const liveVideoUrl = 'http://138.43.158.210:20020/'
  const liveVideoUrl = 'https://compositebridge.org/live-video-feed'

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

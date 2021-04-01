import { useState } from 'react'
import LoadingEllipsis from '../components/LoadingEllipsis'

export default function Live() {
  const liveVideoUrl = 'http://138.43.190.248:20020'

  const [loading, setLoading] = useState(true)

  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
        </div>
        {loading && <LoadingEllipsis />}
        <div className="center-items">
          <img
            src={liveVideoUrl}
            alt="broken page"
            width="100%"
            height="auto"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
      <style jsx>{`
        .root {
          background: white;
          min-height: 100vh;
          text-align: center;
        }

        p {
          margin-top: 2rem;
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

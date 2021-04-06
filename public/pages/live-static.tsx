import { useState, useEffect } from 'react'
import LoadingEllipsis from '../components/LoadingEllipsis'

// const liveVideoUrl = 'http://138.43.190.248:20020/'
// const redirectUrl = 'https://camera.compositebridge.org'
const liveVideoUrl = 'http://ceecam.edu:20020/'

export default function Live() {
  const [imageState, setImageState] = useState('loading')

  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
        </div>
        {imageState === 'loading' && <LoadingEllipsis />}
        {imageState !== 'error' ? (
          <div className="center-items">
            <img
              src={liveVideoUrl}
              alt=""
              height="auto"
              onLoad={() => setImageState('')}
              onError={() => setImageState('error')}
            />
          </div>
        ) : (
          <p>live video feed could not be loaded</p>
        )}
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
          width: 100%;
        }
      `}</style>
    </>
  )
}

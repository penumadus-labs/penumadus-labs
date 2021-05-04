import { useState } from 'react'
import LoadingEllipsis from '../components/LoadingEllipsis'

export default function Live({ ip }: { ip: string }) {
  const [imageState, setImageState] = useState('loading')

  console.log(ip)

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
              src={ip}
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

Live.getInitialProps = async () => {
  const response = await fetch('https://compositebridge.org/api/ip')
  const { ip } = await response.json()
  return { ip: 'http://' + ip }
}

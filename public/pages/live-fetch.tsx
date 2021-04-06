import { useState, useEffect } from 'react'
import LoadingEllipsis from '../components/LoadingEllipsis'

const liveVideoUrl = 'http://138.43.190.248:20020/'
// const liveVideoUrl = 'http://ceecam.edu:20020/'

export default function Live() {
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch(liveVideoUrl, {
          mode: 'cors',
          headers: {
            Connection: 'Keep-Alive',
            'Transfer-Encoding': 'chunked',
            'Content-Type':
              'multipart/x-mixed-replace; boundary=BoundaryString',
            'Access-Control-Allow-Origin': '*',
          },
        })
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
      } catch (error) {}
    })()
  })

  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
        </div>
      </div>
      <div className="center-items">
        <img src={imageUrl} alt="" height="auto" />
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

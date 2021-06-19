import { FC } from 'react'

const dir = 'https://compositebridge.org/static/images/home/'

export const BridgeEvolution: FC = () => {
  return (
    <>
      <div className="root">
        <div className="content">
          <p>original bridge</p>
          <img src={`${dir}old bridge.png`} alt="" />
        </div>
        <div className="arrow">
          <img src={`${dir}arrow.jpg`} alt="" />
        </div>
        <div className="content">
          <p>new bridge deck</p>
          <img src={`${dir}deck.jpeg`} alt="" />
        </div>
        <div className="arrow">
          <img src={`${dir}arrow.jpg`} alt="" />
        </div>
        <div className="content">
          <p>current state</p>
          <video controls autoPlay loop>
            <source src={`${dir}latestmovie.mp4`} type="video/mp4"></source>
            video unsupported
          </video>
        </div>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .arrow {
          flex-basis: 5%;
        }

        .arrow img {
          width: 3rem;
        }

        .content {
          flex-basis: 25%;
        }

        video {
          height: 10rem;
        }

        .content > img {
          width: 100%;
          height: 10rem;
          object-fit: cover;
          vertical-align: middle;
        }
      `}</style>
    </>
  )
}

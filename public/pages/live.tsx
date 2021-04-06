const redirectUrl = 'https://camera.compositebridge.org'
import { BiLinkExternal as Icon } from 'react-icons/bi'

export default function Live() {
  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
          <p>
            <a href={redirectUrl} target="_blank">
              open video feed <Icon size="14" />
            </a>
          </p>
          <div className="center-items">
            <img src="bridge-picture.png" alt="" />
          </div>
        </div>
        <h1 className="title">Contact Information</h1>
        <p>312 John D. Tickle Building</p>
        <p>Phone: 865-974-7708</p>
        <p>
          <a href="mailto: morgancobridge@utk.edu">
            E-mail: morgancobridge@utk.edu <Icon size="14" />
          </a>
        </p>
      </div>
      <style jsx>{`
        .root {
          background: white;
          min-height: 100vh;
          text-align: center;
        }
        * + h1 {
          margin-top: 4rem;
        }

        a {
          color: #0074d9;
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

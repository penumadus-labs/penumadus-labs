const redirectUrl = 'https://camera.compositebridge.org'
import { VscLinkExternal as LinkIcon } from 'react-icons/vsc'
import { HiOutlineMailOpen as MailIcon } from 'react-icons/hi'

export default function Live() {
  return (
    <>
      <div className="root p">
        <div className="hidden-small">
          <h1 className="title">Live Video Feed</h1>
          <p>
            <a href={redirectUrl} target="_blank">
              open video feed <LinkIcon size="14" />
            </a>
          </p>
          <div className="center-items">
            <img src="bridge-picture.png" alt="" />
          </div>
        </div>
        <div className="contact">
          <h1 className="title">Contact Information</h1>

          <h2 className="bold">Dayakar Penumadu</h2>
          <p className="bold info">
            Fred N. Peebles Professor and JIAM Chair of Excellence
          </p>

          <p>325 John D. Tickle Building</p>
          <p>
            <a href="mailto: morgancobridge@utk.edu">
              morgancobridge@utk.edu <MailIcon size="14" />
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        .root {
          background: white;
          min-height: 100vh;
          text-align: center;
        }
        .info {
          max-width: 24rem;
          margin-left: auto;
          margin-right: auto;
        }
        * + h1,
        h2 {
          margin-top: 4rem;
        }

        a {
          /* color: #0074d9; */
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

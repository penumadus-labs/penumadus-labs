import { useState } from 'react'

const initialState = {
  opacity: 0,
  position: '0',
}

export default function SmallNavBar() {
  const [open, setOpen] = useState(false)
  const [{ opacity, position }, setTransition] = useState(initialState)

  const openMenu = () => {
    if (!open) {
      setOpen(true)

      setTimeout(() =>
        setTransition({
          opacity: 1,
          position: '3rem',
        })
      )
    } else {
      setTransition(initialState)
      setTimeout(() => setOpen(false), 500)
    }
  }

  const links = [
    'Home',
    'Safety & Specifications',
    'Design',
    'Process',
    'Testing & Data',
    'Sensors & Telemetry',
  ]

  return (
    <>
      <header className="hidden-large">
        <img src="logo.png" alt="logo.png" />
      </header>
      <div className="menu hidden-large" onClick={openMenu}>
        <div>
          <svg>
            <line x1="0" x2="100%" y1="10%" y2="10%"></line>
            <line x1="0" x2="100%" y1="50%" y2="50%"></line>
            <line x1="0" x2="100%" y1="90%" y2="90%"></line>
          </svg>
        </div>
        {open && (
          <nav>
            <ul>
              {links.map((link, i) => (
                <li key={i}>
                  <a className="qs-link link" href={`/#${link}`}>
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <a className="link faded" href="./live">
                  LIve Video Feed
                </a>
              </li>
              <li>
                <a
                  className="link faded"
                  href="https://admin.compositebridge.org"
                >
                  Data Analysis
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <style jsx>{`
        .menu {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          position: sticky;
          top: 0;
          cursor: pointer;
        }

        header {
          padding-bottom: 5%;
        }

        header,
        .menu {
          background: white;
          z-index: 20;
          /* margin: 0 auto; */
        }

        .menu > div {
          position: relative;
          border-top: 0.2rem solid var(--orange);
          border-bottom: 0.2rem solid var(--orange);
        }

        svg {
          display: block;
          margin: 0.4rem auto;
          width: 2em;
          height: 1.5rem;
        }

        img {
          height: auto;
          width: 100%;
        }

        line {
          stroke-width: 0.13rem;
          stroke: var(--gray);
        }

        nav {
          background: white;
          transition: opacity top;
          transition-duration: 0.5s;
          opacity: ${opacity};
          top: ${position};
          position: absolute;
          z-index: 15;
          width: 100%;
        }

        a {
          text-align: center;
          padding: 0.5rem;
        }
      `}</style>
    </>
  )
}

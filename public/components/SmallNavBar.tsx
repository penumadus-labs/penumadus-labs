import { useState } from 'react'

const animationDuration = 500

console.log(animationDuration / 1000)

const initialState = {
  opacity: 0,
  position: '-4rem',
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
          position: '0',
        })
      )
    } else {
      setTransition(initialState)
      setTimeout(() => setOpen(false), animationDuration)
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
      <header className="visible-small">
        <img src="logo.png" alt="logo.png" />
      </header>
      <div className="menu visible-small" onClick={openMenu}>
        <div>
          <svg>
            <line x1="0" x2="100%" y1="10%" y2="10%"></line>
            <line x1="0" x2="100%" y1="50%" y2="50%"></line>
            <line x1="0" x2="100%" y1="90%" y2="90%"></line>
          </svg>
        </div>
      </div>
      <div className="anchor visible-small">
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

        .anchor {
          position: relative;
        }

        nav {
          background: white;
          transition: opacity top;
          transition-duration: ${animationDuration / 1000}s;
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

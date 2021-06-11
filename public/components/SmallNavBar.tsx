import { useState } from 'react'
import { useRoutes } from '../routes'

const animationDuration = 500

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
  const [routes] = useRoutes()

  return (
    <>
      <header className="visible-small">
        <img src="logo.png" alt="logo.png" />
      </header>
      <div className="menu-container visible-small">
        <div className="menu">
          <div onClick={openMenu}>
            <svg>
              <line x1="0" x2="100%" y1="10%" y2="10%"></line>
              <line x1="0" x2="100%" y1="50%" y2="50%"></line>
              <line x1="0" x2="100%" y1="90%" y2="90%"></line>
            </svg>
          </div>
        </div>
        <div className="anchor">
          {open && (
            <nav>
              <ul>
                {routes.map(({ active, href, title }, i) => (
                  <li key={i}>
                    <a
                      className={`link ${active} ${
                        href[1] === '#' ? '' : 'faded'
                      }`}
                      href={href}
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
      <style jsx>{`
        .menu-container {
          z-index: 15;
          position: sticky;
          top: 0;
        }

        .menu {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          cursor: pointer;
        }

        header {
          padding-bottom: 5%;
        }

        header,
        .menu {
          background: white;
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

        a {
          text-align: center;
          padding: 0.5rem;
        }

        .anchor {
          position: relative;
        }

        nav {
          position: absolute;
          background: white;
          transition: opacity top;
          transition-duration: ${animationDuration / 1000}s;
          opacity: ${opacity};
          top: ${position};
          width: 100%;
        }
      `}</style>
    </>
  )
}

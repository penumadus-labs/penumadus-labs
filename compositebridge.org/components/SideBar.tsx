import { useRoutes } from '../routes'

export default function SideBar() {
  const [routes] = useRoutes()

  return (
    <>
      <div className="hidden-small">
        <div className="placeholder" />
        <div className="sidebar">
          <div>
            <div className="logo">
              <div className="img-container ic1">
                <img
                  style={{ background: 'white', cursor: 'pointer' }}
                  src="logo.png"
                  alt="logo.png"
                  height="auto"
                  width="100%"
                />
              </div>
            </div>
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
            <div className="logo">
              <div className="img-container ic2">
                <img src="combined logo.png" alt="combined logo.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        img {
          vertical-align: bottom;
          width: 100%;
        }

        .sidebar,
        .placeholder,
        .logo {
          width: var(--sidebar-width);
        }

        .logo {
          padding-left: calc(var(--sidebar-width) - 16rem);
        }

        .img-container {
          background: white;
          display: flex;
          align-items: center;
        }
        .ic1 {
          padding-top: 0.25rem;
          padding-bottom: 1rem;
        }
        .ic2 {
          padding: 0.5rem 1rem;
        }

        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          margin-top: 1rem;
          display: flex;
          align-items: center;
        }

        ul {
          border-right: 5px solid var(--orange);
          margin-right: 1rem;
          padding: 1rem 0;
        }

        li {
          padding: 0.5rem 0;
          text-align: right;
        }

        a {
          padding: 0.5rem 0;
          padding-right: 1rem;
          color: white;
          white-space: nowrap;
        }
      `}</style>
    </>
  )
}

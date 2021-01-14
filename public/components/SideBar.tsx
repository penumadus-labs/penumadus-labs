import Link from 'next/link'

export default function SideBar() {
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
      <div className="placeholder" />
      <div className="sidebar">
        <div>
          <div className="logo">
            <div className="img-container ic1">
              <Link href="/">
                <img
                  style={{ background: 'white', cursor: 'pointer' }}
                  src="logo.png"
                  alt="logo.png"
                  height="auto"
                  width="100%"
                />
              </Link>
            </div>
          </div>
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
                  live video feed
                </a>
              </li>
              <li>
                <a
                  className="link faded"
                  href="https://admin.compositebridge.org"
                >
                  data analysis
                </a>
              </li>
            </ul>
          </nav>
          <div className="logo">
            <div className="img-container ic2">
              <img src="combined logo.png" alt="combined logo.png" />
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
          width: 18rem;
        }

        .logo {
          padding-left: 4rem;
        }

        .img-container {
          background: white;
        }
        .ic1 {
          padding: 0.25rem 0;
        }
        .ic2 {
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
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
          margin-right: 0.5rem;
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

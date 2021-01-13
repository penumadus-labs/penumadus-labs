import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

export default function SideBar() {
  const [sideBarWidth, setSideBarWidth] = useState('0')
  useEffect(() => {
    if (sideBarRef.current) {
      const { width } = getComputedStyle(sideBarRef.current)
      setSideBarWidth(width)
    }
  }, [])
  const links = [
    'Home',
    'Safety & Specifications',
    'Design',
    'Process',
    'Testing & Data',
    'Sensors & Telemetry',
  ]
  const sideBarRef = useRef<HTMLDivElement>(null)
  const iacmiRef = useRef<HTMLDivElement>(null)
  const utRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="placeholder" />
      <div className="sidebar">
        <div>
          <div className="logo">
            <div className="img-wrapper">
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
          <nav ref={sideBarRef}>
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
          <div className="logo-wrapper">
            <div className="img-wrapper">
              <img src="iacmi.png" alt="iacmi.png" />
              <img src="ut.png" alt="ut.png" />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        img {
          vertical-align: bottom;
        }

        .img-wrapper {
          background: white;
          padding: 0.5rem 0;
          width: 100%;
        }
        .logo,
        .placeholder,
        .logo-wrapper {
          width: ${sideBarWidth};
        }

        .logo,
        .logo-wrapper {
          padding-left: 4rem;
        }

        .logo-wrapper > .img-wrapper {
          display: flex;
          justify-content: space-evenly;
          height: 100px;
          text-align: center;
        }

        .logo-wrapper img {
          width: auto%;
          height: 100%;
        }
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          display: grid;
          place-items: center;
        }
        ul {
          border-right: 5px solid var(--orange);
          margin-right: 1rem;
          padding: 1rem 0;
        }
        li {
          padding: 1.5rem 0;
          text-align: right;
        }
        a {
          padding-right: 0.5rem;
          padding-left: 4rem;
          color: white;
        }
      `}</style>
    </>
  )
}

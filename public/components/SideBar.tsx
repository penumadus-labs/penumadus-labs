import Link from 'next/link'

export default function SideBar() {
  const links = [
    'Home',
    'Safety & Specifications',
    'Design',
    'Process',
    'Testing & Data',
    'Sensors & Telemetry',
    'Other Links & Data'
  ]
  return (
    <>
      <nav>
        <ul>
          {links.map((link, i) => (
            <li key={i}>
              <a className="content-link" href={`#${link}`}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        nav {
          position: fixed;
          top: var(--fixed-height);
          right: calc(50vw + 22rem);
        }
        li {
          margin-bottom: 1rem;
        }
        li:hover {
        }
      `}</style>
    </>
  )
}

import Link from 'next/link'

export default function SideBar() {
  const links = [
    'content area 1',
    'content area 2',
    'content area 3',
    'content area 4',
    'content area 5',
    'other links',
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

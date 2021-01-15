import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/dist/client/router'

const navLinks = [
  ['/', 'home'],
  [`https://admin.compositebridge.org`, 'Data Analysis'],
  ['/live', 'LIve Video Feed'],
  ['/static', 'utilities'],
]

export default function NavBar() {
  const { pathname } = useRouter()

  const links = useMemo(
    () =>
      navLinks.map(([href, text], i) => (
        <li key={i}>
          <Link href={href}>
            <a
              className={href === pathname ? 'active' : ''}
              style={{ marginRight: '2rem' }}
            >
              {text}
            </a>
          </Link>
        </li>
      )),
    [pathname]
  )
  return (
    <>
      <nav id="other links">
        <ul className="fixed-height container">{links}</ul>
      </nav>
      <style jsx>{`
        nav li {
          margin-right: 2rem;
        }
      `}</style>
    </>
  )
}

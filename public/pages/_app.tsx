import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/index.scss'
import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/dist/client/router'

const navLinks = [
  ['/', 'home'],
  [`https://admin.compositebridge.org`, 'data analysis'],
  ['/live', 'live video feed'],
  ['/static', 'utilities'],
]

export default function App({ Component, pageProps }: AppProps) {
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
      <Head>
        <title>Composite Bridge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="container fixed-height">
        <h1>
          <Link href="/">
            <a>Composite Bridge</a>
          </Link>
        </h1>
      </header>
      <main className="container">
        <Component {...pageProps} />
      </main>
      <footer>
        <nav id="other links">
          <ul className="fixed-height container">{links}</ul>
        </nav>
      </footer>
      <style jsx>{`
        nav li {
          margin-right: 2rem;
        }
      `}</style>
    </>
  )

  //<Component {...pageProps} />
}

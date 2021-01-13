import ActivateLinks from '../components/ActivateLinks'
import SideBar from '../components/SideBar'
import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/index.scss'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Composite Bridge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="layout">
        <header>
          <SideBar />
          <ActivateLinks />
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
      <footer></footer>
      <style jsx>{`
        .layout {
          display: grid;
          grid-template-columns: auto 1fr;
        }
        h1 {
          background: white;
        }
        header {
          display: grid;
          place-items: center;
        }
        main {
          margin-right: 6rem;
          margin-left: 2rem;
        }
      `}</style>
    </>
  )

  //<Component {...pageProps} />
}

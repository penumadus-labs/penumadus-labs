import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Composite Bridge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>
          <a href="/">Composite Bridge</a>
        </h1>
        <nav>
          <a href="https://admin.compositebridge.org">dashboard</a>
          <a href="./static">utilities</a>
          <a href="./live">live video feed</a>
        </nav>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer></footer>
      <style jsx>{`
        header {
          margin: 0;
          background: #333;
          padding: 0.5rem 1rem;
          color: #eee;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        main {
          margin: 1rem;
        }

        nav {
          display: flex;
        }

        nav > * {
          margin-right: 1rem;
        }
      `}</style>
    </>
  )

  //<Component {...pageProps} />
}

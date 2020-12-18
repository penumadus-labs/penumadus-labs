import Head from 'next/head'

export default function Home() {
  const redirect = () => {
    window.location.href = 'http://hankthetank.me:20020'
  }
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
          <a href="./app">dashboard</a>
          <a href="./static">utilities</a>
          <button onClick={redirect}>live video feed</button>
        </nav>
      </header>
      <main>
        {/* <div className="responsive-iframe-container">
          <iframe src="http://hankthetank.me:20020" />
        </div> */}
        <div className="responsive-iframe-container">
          <iframe
            src="https://www.youtube-nocookie.com/embed/pSOBWOKEmJE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </main>
      <footer></footer>
      <style jsx>{`
        header {
          margin: 0;
          background: gray;
          padding: 0.5rem;
          color: #eee;
          padding-left: 4rem;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        main {
          margin: 4rem;
          padding: 4rem;
          background: white;
        }

        nav {
          display: flex;
        }

        nav > * {
          margin-left: 1rem;
        }
      `}</style>
    </>
  )
}

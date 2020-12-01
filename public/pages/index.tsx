import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>
          <a href="/">Composite Bridge</a>
        </h1>
        <nav>
          <a href="./app">go to app</a>
        </nav>
      </header>
      <main>
        <div className="responsive-iframe-container">
          <iframe
            className="responsive-iframe"
            src="https://www.youtube-nocookie.com/embed/pSOBWOKEmJE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </main>
      <footer></footer>
      <style jsx>{`
        header {
          margin: 0;
          background: gray;
          padding: 0.5rem;
          color: #eee;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        main {
          margin: 4rem;
          padding: 4rem;
          background: white;
        }

        .iframe-container {
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </>
  )
}

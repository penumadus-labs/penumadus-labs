import Head from 'next/head'
import { useRef, useEffect } from 'react'
import axios from 'axios'

const liveVideoUrl = 'http://138.43.158.210:20020/'

export default function Home() {
  const ref = useRef()
  // useEffect(() => {
  //   const iframe = ref?.current
  //   if (!iframe) return

  //   const doc = iframe.contentDocument || iframe.contentWindow.document

  //   const elm = doc.querySelector('html')

  //   console.log(elm.getAttribute('style'))
  // }, [ref])

  // useEffect(() => {
  //   fetch(liveVideoUrl, {
  //     headers: {
  //       'Content-Type': 'text/html',
  //     },
  //     mode: 'no-cors',
  //   })
  //     .then(async res => {
  //       console.log(await res.text())
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  //   axios(liveVideoUrl, {
  //     headers: { 'Access-Control-Allow-Origin': '*' },
  //     withCredentials: true,
  //   })
  //     .then(async ({ data }) => {
  //       console.log(data)
  //     })
  //     .catch(err => console.log(err))
  // })
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
          <a href={liveVideoUrl} target="blank">
            live video feed
          </a>
        </nav>
      </header>
      <main>
        {/* <div className="responsive-iframe-container">
          <iframe ref={ref} src={liveVideoUrl} />
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
}

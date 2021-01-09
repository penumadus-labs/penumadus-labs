export default function Home() {
  return (
    <>
      <div className="responsive-iframe-container">
        <iframe
          src="https://www.youtube-nocookie.com/embed/pSOBWOKEmJE"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <style jsx>{`
        .responsive-iframe-container {
          --height: 80%;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;

          padding-top: calc(var(--height) * 0.5625);
          /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
          margin: 0 auto;
        }

        /* Then style the iframe to fit in the container div with full height and width */
        .responsive-iframe-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  )
}

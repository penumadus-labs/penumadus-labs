export default function YouTubeVideo() {
  return (
    <div className="responsive-iframe-container">
      <iframe
        title="vimeo-player"
        // src="https://www.youtube-nocookie.com/embed/pSOBWOKEmJE"
        src="https://player.vimeo.com/video/511751523"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

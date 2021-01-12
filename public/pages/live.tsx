export default function Live() {
  // const liveVideoUrl = 'http://138.43.158.210:20020/'
  const liveVideoUrl = 'https://compositebridge.org/live-video-feed'

  return (
    <>
      <img src={liveVideoUrl} alt={liveVideoUrl} width="100%" height="auto" />
    </>
  )
}

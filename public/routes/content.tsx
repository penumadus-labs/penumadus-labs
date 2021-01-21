import { FC } from 'react'

const FillerContent: FC<{
  name?: string
  src?: string
  maxWidth?: string
}> = ({ name, src, maxWidth = 'initial' }) => {
  return (
    <>
      <p>{name}</p>
      <img src={src} alt="No Content Provided" />
      <style jsx>{`
        img {
          margin-top: 2rem;
          font-size: 2rem;
          width: 100%;
          max-width ${maxWidth};
          height: auto;
        }
      `}</style>
    </>
  )
}

const fillerContentDir = 'https://compositebridge.org/static/images/'

export const home = (
  <>
    <p>
      Smart Composite Deck A low cost, light weight composite bridge deck.
      Caroline
    </p>
    <FillerContent src={`${fillerContentDir}newhome1.jpg`} maxWidth="1000px" />
    <FillerContent src={fillerContentDir + 'newhome2.jpg'} />
    <FillerContent src={`${fillerContentDir}newhome3.jpg`} />
    <FillerContent src={fillerContentDir + 'home.JPG'} />
  </>
)

export const design = (
  <>
    <p>Andrew</p>
    <FillerContent src={`${fillerContentDir}newdesign1.JPG`} />
    <FillerContent src={`${fillerContentDir}newdesign2.JPG`} />
    <FillerContent src={`${fillerContentDir}newdesign3.JPG`} />
    <FillerContent src={`${fillerContentDir}newdesign4.JPG`} />
    <FillerContent src={`${fillerContentDir}design5.JPG`} />
    <FillerContent src={`${fillerContentDir}design6.JPG`} />
    <FillerContent src={`${fillerContentDir}design7.JPG`} />
    <FillerContent src={`${fillerContentDir}acceleration-graph.png`} />
  </>
)

export const sensors = (
  <>
    <p>Stephen/George/Ryan</p>
    <FillerContent src={`${fillerContentDir}Slide1.jpeg`} />
    <FillerContent src={`${fillerContentDir}Slide3.jpeg`} />
    <FillerContent src={fillerContentDir + 'Slide4.jpeg'} />
    <FillerContent src={fillerContentDir + 'Slide5.jpeg'} />
    <FillerContent src={`${fillerContentDir}sensors1.JPG`} />
    <FillerContent src={fillerContentDir + 'sensors2.JPG'} />
    <FillerContent src={`${fillerContentDir}sensors3.JPG`} />
    <FillerContent src={fillerContentDir + 'sensors4.JPG'} />
  </>
)

export const partners = (
  <>
    <p></p>
    <FillerContent src={fillerContentDir + 'partners.JPG'} />
  </>
)

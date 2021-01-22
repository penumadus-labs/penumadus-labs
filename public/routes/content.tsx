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

const homeDir = fillerContentDir + 'home/v2/'

export const home = (
  <>
    <p>
      Smart Composite Deck A low cost, light weight composite bridge deck.
      Caroline
    </p>
    <FillerContent src={`${homeDir}home1.JPG`} maxWidth="1000px" />
    <FillerContent src={`${homeDir}home2.JPG`} />
    <FillerContent src={`${homeDir}home3.JPG`} />
    {/* <FillerContent src={`${fillerContentDir}home.JPG`} /> */}
  </>
)

const designDir = fillerContentDir + 'design/'

export const design = (
  <>
    <p>Andrew</p>
    <FillerContent src={`${designDir}design1.1.JPG`} />
    <FillerContent src={`${designDir}design1.2.JPG`} />
    <FillerContent src={`${designDir}design1.3.JPG`} />
    <FillerContent src={`${designDir}design1.4.JPG`} />
    <FillerContent src={`${designDir}design1.5.JPG`} />
    <FillerContent src={`${designDir}design1.6.JPG`} />
    <FillerContent src={`${designDir}design1.7.JPG`} />
    <FillerContent src={`${designDir}design2.1.JPG`} />
    <FillerContent src={`${designDir}design2.2.JPG`} />
    <FillerContent src={`${designDir}design2.3.JPG`} />
    <FillerContent src={`${designDir}design2.4.JPG`} />
    <FillerContent src={`${designDir}acceleration-graph.png`} />
  </>
)

const sensorsDir = fillerContentDir + 'sensors/'

export const sensors = (
  <>
    <p>Stephen/George/Ryan</p>
    <FillerContent src={`${sensorsDir}Slide1.jpeg`} />
    <FillerContent src={`${sensorsDir}Slide3.jpeg`} />
    {/* <FillerContent src={`${sensorsDir}Slide4.jpeg`} /> */}
    <FillerContent src={`${sensorsDir}Slide5.jpeg`} />
    <FillerContent src={`${sensorsDir}sensors1.JPG`} />
    <FillerContent src={`${sensorsDir}sensors2.JPG`} />
    <FillerContent src={`${sensorsDir}sensors3.JPG`} />
    <FillerContent src={`${sensorsDir}sensors4.JPG`} />
  </>
)

export const partners = (
  <>
    <p></p>
    <FillerContent src={fillerContentDir + 'partners.JPG'} />
  </>
)

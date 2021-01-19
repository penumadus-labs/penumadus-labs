import { FC } from 'react'

const FillerContent: FC<{ name?: string; src?: string }> = ({ name, src }) => {
  return (
    <>
      <p>{name}</p>
      <img src={src} alt="No Content Provided" />
      <style jsx>{`
        img {
          margin-top: 2rem;
          font-size: 2rem;
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
    <FillerContent />
  </>
)

export const safety = (
  <>
    <p>Joey/Andrew</p>
    <FillerContent />
  </>
)

export const design = (
  <>
    <p>Andrew</p>
    <FillerContent src={fillerContentDir + 'Slide2.jpeg'} />
    <FillerContent src={fillerContentDir + 'Slide5.jpeg'} />
  </>
)

export const process = (
  <>
    <p>Joey</p>
    <FillerContent />
  </>
)

export const testing = (
  <>
    <p>George/Stephen/Abram</p>
    <FillerContent src={`${fillerContentDir}Slide1.jpeg`} />
    <FillerContent src={`${fillerContentDir}Slide3.jpeg`} />
  </>
)

export const sensors = (
  <>
    <p>Stephen/George/Ryan</p>
    <FillerContent src={fillerContentDir + 'Slide4.jpeg'} />
  </>
)

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
    <FillerContent />
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
    <FillerContent />
  </>
)

export const sensors = (
  <>
    <p>Stephen/George/Ryan</p>
    <FillerContent />
  </>
)

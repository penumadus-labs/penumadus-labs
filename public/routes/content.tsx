import { FC } from 'react'
import { HoverDiagram } from '../components/HoverDiagram'
import { BridgeEvolution } from './BridgeEvolution'
import { FlowchartContent } from './FlowchartContent'
import { hoverDiagramContent } from './hover-diagram-content'
import { sensorsContent } from './sensors-content'

export const FillerContent: FC<{
  name?: string
  src?: string
  maxWidth?: string
  topMargin?: boolean
}> = ({ name, src, topMargin = true, maxWidth = 'initial' }) => {
  return (
    <>
      <p>{name}</p>
      <img src={src} alt="No Content Provided" />
      <style jsx>{`
        img {
          ${topMargin ? 'margin-top: 2rem;' : ''}
          font-size: 2rem;
          vertical-align: middle;
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
const updateDir = fillerContentDir + 'jan28/'

export const home = (
  <>
    <FillerContent src={`${updateDir}home1.JPG`} />
    <BridgeEvolution />
    <FillerContent src={`${updateDir}home2.JPG`} />
    <FillerContent src={`${updateDir}home3.JPG`} />
  </>
)

// const designDir = fillerContentDir + 'design/'
const processDir = fillerContentDir + 'process/'

export const design = (
  <>
    <p className="ugly-header">hover over images for more information</p>
    <FlowchartContent src={`${processDir}fullprocess.jpeg`} />

    <style jsx>{``}</style>
  </>
)

const sensorsDir = fillerContentDir + 'sensors/'

export const sensors = (
  <>
    {sensorsContent}
    {/* <FillerContent src={`${sensorsDir}Slide1.jpeg`} /> */}
    <p className="ugly-header">hover over any object for more information</p>
    <HoverDiagram src={`${sensorsDir}Slide3.jpeg`}>
      {hoverDiagramContent}
    </HoverDiagram>
    <FillerContent src={`${sensorsDir}straingraph.jpg`} />
  </>
)

const futureDir = fillerContentDir + 'future/'

export const future = (
  <>
    <FillerContent src={`${futureDir}future1.JPG`} />
    <FillerContent src={`${futureDir}future2.JPG`} />
    <FillerContent src={`${futureDir}future3.JPG`} />
  </>
)

export const partners = (
  <>
    <FillerContent src={fillerContentDir + 'partners.JPG'} />
  </>
)

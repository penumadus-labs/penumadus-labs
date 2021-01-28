import { FC } from 'react'
import { HoverDiagram } from '../components/HoverDiagram'
import { BridgeEvolution } from './BridgeEvolution'
import { FlowchartContent } from './FlowchartContent'
import { hoverDiagramContent } from './hover-diagram-content'

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

export const home = (
  <>
    <FillerContent src={`${homeDir}home1.JPG`} />
    <FillerContent src={`${homeDir}home2.JPG`} />
    <FillerContent src={`${homeDir}home3.JPG`} />
    <BridgeEvolution />
  </>
)

const designDir = fillerContentDir + 'design/'
const processDir = fillerContentDir + 'process/'

export const design = (
  <>
    <FillerContent src={`${designDir}design1.7.JPG`} />
    <FillerContent src={`${designDir}design2.1.JPG`} />
    <FillerContent src={`${designDir}design2.1.JPG`} />
    <FillerContent src={`${designDir}design2.3.JPG`} />
    <FillerContent src={`${designDir}design2.4.JPG`} />
    <p className="ugly-header">hover over images for more information</p>
    <FlowchartContent src={`${processDir}fullprocess.jpeg`} />
    <style jsx>{``}</style>
  </>
)

const sensorsDir = fillerContentDir + 'sensors/'

export const sensors = (
  <>
    <FillerContent src={`${sensorsDir}Slide1.jpeg`} />
    <p className="ugly-header">hover over any object for more information</p>
    <HoverDiagram src={`${sensorsDir}Slide3.jpeg`}>
      {hoverDiagramContent}
    </HoverDiagram>
    <FillerContent src={`${sensorsDir}Slide4.jpeg`} />
  </>
)

export const partners = (
  <>
    <FillerContent src={fillerContentDir + 'partners.JPG'} />
  </>
)

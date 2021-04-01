import { FC } from 'react'
import { HoverDiagram } from '../components/HoverDiagram'
import { FlowchartContent } from './content/FlowchartContent'
import { futureContent } from './content/future'
import { homeContent } from './content/home'
import { hoverDiagramContent } from './content/hover-diagram'
import * as sensor from './content/sensors'

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

export const home = homeContent

export const design = (
  <>
    <p className="ugly-header">hover over images for more information</p>
    <FillerContent topMargin={false} src="slides/fullprocess.jpeg" />
    {/* <FlowchartContent src={'slides/fullprocess.jpeg'} /> */}
  </>
)

export const sensors = (
  <>
    {sensor.content1}
    <p className="ugly-header">hover over any object for more information</p>
    <HoverDiagram src={'slides/bridge-diagram.jpeg'}>
      {hoverDiagramContent}
    </HoverDiagram>
    {sensor.content2}
  </>
)

export const future = futureContent

export const partners = (
  <>
    <FillerContent
      src={'https://compositebridge.org/static/images/partners.JPG'}
    />
  </>
)

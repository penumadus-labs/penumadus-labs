import { HoverDiagram } from '../components/HoverDiagram'
import { hoverDiagramContent } from '../routes/hover-diagram-content'

export default function Test() {
  return (
    <HoverDiagram
      src={'https://compositebridge.org/static/images/sensors/Slide3.jpeg'}
    >
      {hoverDiagramContent}
    </HoverDiagram>
  )
}

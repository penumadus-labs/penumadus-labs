import { objectToCSS, ShapeProps } from '../../utils/css'

interface LineProps extends ShapeProps {
  negative?: boolean
}

export default function Line({ negative = false, css = {} }: LineProps) {
  return (
    <>
      <svg className="visible-large">
        <line
          x1="0"
          y1={negative ? '0' : '100%'}
          x2="100%"
          y2={negative ? '100%' : '0'}
        />
      </svg>
      <style jsx>{`
        svg {
          ${objectToCSS(css)}
          position: absolute;
        }
        line {
          stroke: var(--orange);
          stroke-width: 0.5rem;
        }
      `}</style>
    </>
  )
}

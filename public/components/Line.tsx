import { objectToCSS, cssObj } from '../utils/css'

export default function Line({
  negative = false,
  css = {},
}: {
  negative?: boolean
  css: cssObj
}) {
  return (
    <>
      <svg>
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

        svg line {
          stroke: var(--orange);
          stroke-width: 12;
        }
      `}</style>
    </>
  )
}

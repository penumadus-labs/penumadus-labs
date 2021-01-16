import { objectToCSS, ShapeProps } from '../../utils/css'
export default function Box({
  css = {},
  className = 'visible-medium-and-down',
}: ShapeProps) {
  return (
    <>
      <div className={className} />
      <style jsx>{`
        div {
          background: var(--gray);
          ${objectToCSS(css)}
        }
      `}</style>
    </>
  )
}

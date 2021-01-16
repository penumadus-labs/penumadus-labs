import { ReactChild } from 'react'

type cssObj = { [key: string]: string }

export interface ShapeProps {
  className?: string
  root?: string
  children?: ReactChild
  css?: cssObj
}

const objectToCSS = (obj: cssObj) =>
  Object.entries(obj).reduce(
    (css, [key, value]) => css + `${key}: ${value};\n`,
    ''
  )

export default function Shape({
  children,
  css = {},
  root = 'div',
}: ShapeProps) {
  console.log(css)
  return (
    <>
      {children}
      <style jsx>{`
        ${root} {
          ${objectToCSS(css)}
        }
      `}</style>
    </>
  )
}

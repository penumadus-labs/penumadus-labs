import { ReactChild } from 'react'
type cssObj = { [key: string]: string }

export interface ShapeProps {
  className?: string
  children?: ReactChild
  css?: cssObj
}

export const objectToCSS = (obj: cssObj) =>
  Object.entries(obj).reduce(
    (css, [key, value]) => css + `${key}: ${value};\n`,
    ''
  )

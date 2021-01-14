export type cssObj = { [key: string]: string }

export const objectToCSS = (obj: cssObj) =>
  Object.entries(obj).reduce(
    (css, [key, value]) => css + `${key}: ${value};\n`,
    ''
  )

export const breakpoints = {
  charts: 1280,
  layout: 820,
}

const entries = Object.entries(breakpoints)

export const le = entries.reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (max-width: ${value}px)`
  return acc
}, {})

export const gt = entries.reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (min-width: ${value + 1}px)`
  return acc
}, {})

export const breakpoints = {
  sm: 600,
  md: 960,
  lg: 1280,
  layout: 820,
}

export const le = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (max-width: ${value}px)`
  return acc
}, {})

export const gt = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (min-width: ${value + 1}px)`
  return acc
}, {})

export default {
  le,
  gt,
}

export const breakpoints = {
  sm: 600,
  md: 960,
  lg: 1280,
  layout: 820,
}

const mediaqueries = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (max-width: ${value}px)`
  return acc
}, {})

export default mediaqueries

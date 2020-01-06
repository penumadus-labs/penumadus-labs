const breakPoints = {
  sm: 576,
  md: 768,
  lg: 992,
}

const mediaQueries = {
  sm: `@media (max-width: ${breakPoints.sm}px)`,
  md: `@media (max-width: ${breakPoints.md}px)`,
  lg: `@media (max-width: ${breakPoints.lg}px)`,
}

export { mediaQueries, breakPoints }

import { breakpoints } from '../style/mediaqueries'

function responsive(settings) {
  if (window.innerWidth < breakpoints.sm && settings.sm !== undefined) {
    return settings.sm
  } else if (window.innerWidth < breakpoints.md && settings.md !== undefined) {
    return settings.md
  } else if (window.innerWidth < breakpoints.lg && settings.lg !== undefined) {
    return settings.lg
  } else if (
    window.innerWidth < breakpoints.layout &&
    settings.layout !== undefined
  ) {
    return settings.layout
  } else {
    return settings.default
  }
}

export default responsive

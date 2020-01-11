import breakpoints from '../style/breakpoints'

function responsive(settings) {
  if (window.innerWidth < breakpoints.sm && settings.sm !== undefined) {
    return settings.sm
  } else if (window.innerWidth < breakpoints.md && settings.md !== undefined) {
    return settings.md
  } else if (window.innerWidth < breakpoints.lg && settings.lg !== undefined) {
    return settings.lg
  } else {
    return settings.df
  }
}

export default responsive

import mixins from './mixins'
import mediaQueries from './mediaqueries'

const theme = {
  mediaQueries,
  mixins,
  color: {
    navBackground: '#272727',
    background: '#1e1e1e',
    icon: '#909090',
    font: '#ddd',
    // border: "#363636",
    hover: '#3e3e3e',
    active: '#4e4e4e',
    selected: '#373737',
  },
  font: {
    size: {
      link: '.65rem',
      text: '.9rem',
      heading: '2rem',
    },
    family: "Verdana, 'Montserrat', sans-serif",
    leterSpacing: '.05rem',
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px' },
  layout: {
    header: {
      height: '65px',
    },
    navbar: {
      size: '85px',
    },
  },
  shape: {
    borderRadius: '5px',
  },
  zIndex: [10, 20, 30],
  // transitions: {},
  // shadows: {},
}

theme.mixins.style = `
  font-family: ${theme.font.family};
  font-size: ${theme.font.size.text}
  letter-spacing: ${theme.font.letterSpacing}
  color: ${theme.color.font};
  background: ${theme.color.icon};
  margin-top: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.shape.borderRadius};
`

export default theme

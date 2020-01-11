import breakpoints from './breakpoints';

const mediaQueries = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media screen and (max-width: ${value}px)`;
  return acc;
}, {});

export default mediaQueries;

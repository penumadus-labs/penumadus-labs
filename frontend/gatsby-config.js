require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `HankMon-UI`,
  },
  plugins: [`gatsby-plugin-styled-components`],
}

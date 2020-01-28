const { options, queries } = require('./db-config')

module.exports = {
  siteMetadata: {
    title: `HankMon-UI`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-mysql`,
      options,
      queries,
    },
  ],
}

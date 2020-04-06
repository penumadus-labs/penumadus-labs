const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development'

if (process.version.slice(1, 3) < 13) {
  console.error(`error: "${process.version}" is wrong version of node`)
  process.exit(1)
}

console.log(`Using environment config: ${activeEnv}`)
require('dotenv').config({ path: `.env.${activeEnv}` })

module.exports = {
  siteMetadata: {
    title: `HankMon-UI`,
  },
  plugins: [`gatsby-plugin-styled-components`],
}

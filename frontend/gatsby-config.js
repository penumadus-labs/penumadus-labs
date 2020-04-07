if (process.version.slice(1, 3) < 13) {
  console.error(`error: "${process.version}" is wrong version of node`)
  process.exit(1)
}

module.exports = {
  siteMetadata: {
    title: `HankMon-UI`,
  },
  plugins: [`gatsby-plugin-styled-components`],
}

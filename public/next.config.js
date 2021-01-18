const { join } = require('path')
// const withSass = require('@zeit/next-sass')
// module.exports = withSass({
//   /* by default config  option Read For More Options
// here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
//   cssModules: true,
// })
module.exports = {
  sassOptions: {
    includePaths: [join(__dirname, 'styles')],
  },
}

const { unparse } = require('papaparse')

const handleAsync = (routeHandler) => async (req, res) => {
  try {
    await routeHandler(req, res)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

const handleQuery = (resolver) =>
  handleAsync(async ({ query, res }) => {
    res.send(await resolver(query, res))
  })

const handlePost = (handler) =>
  handleAsync(async ({ body }, res) => {
    const status = await handler(body, res)
    res.sendStatus(status ?? 200)
  })

const handleDownload = (resolver) =>
  handleAsync(
    handleQuery(async (query, res) => {
      const { data } = await resolver(query)
      res.setHeader('Content-type', 'application/csv')
      res.setHeader('Content-disposition', 'attachment; filename=Report.csv')
      return unparse(data)
    })
  )

module.exports = {
  handleAsync,
  handleQuery,
  handlePost,
  handleDownload,
}

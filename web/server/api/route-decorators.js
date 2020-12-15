const { unparse } = require('papaparse')

const handleAsync = (routeHandler) => async (req, res) => {
  try {
    await routeHandler(req, res)
  } catch (error) {
    console.error(error)
    res.statusMessage = "something didn't work"
    res.sendStatus(500)
  }
}

const handleQuery = (resolver) =>
  handleAsync(async ({ query, res }) => {
    const data = await resolver(query, res)
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

      return unparse(
        data.map(({ sensors = [], time, ...data }) => {
          sensors.forEach((sensor, i) => {
            data[`T${i + 1}`] = sensor
          })

          const excelTime = time / 86400 + 25569

          return {
            'unix time': time,
            'Excel datetime format': excelTime,
            'Eastern Standard Time': excelTime - 5 / 24,
            ...data,
          }
        })
      )
    })
  )

module.exports = {
  handleAsync,
  handleQuery,
  handlePost,
  handleDownload,
}

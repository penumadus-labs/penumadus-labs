const handleAsync = (routeHandler) => async (req, res) => {
  try {
    await routeHandler(req, res)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = handleAsync

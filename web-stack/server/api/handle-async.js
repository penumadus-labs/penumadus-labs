const handleAsync = (promise) => async (req, res) => {
  try {
    await promise(req, res)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = handleAsync
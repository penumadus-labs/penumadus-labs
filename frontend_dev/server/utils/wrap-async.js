const wrapAsync = func => {
  return (req, res) => func(req, res).catch(console.error)
}

module.exports = wrapAsync

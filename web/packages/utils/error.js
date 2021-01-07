module.exports.expectString = (value) => {
  if (typeof value !== 'string') {
    console.error(value)
    throw new Error('expected string')
  }
}

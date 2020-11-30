module.exports = ({ input, limit }) => {
  return { $slice: [input, -limit, +limit] }
}

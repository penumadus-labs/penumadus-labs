module.exports = ({ input, resolution }) => {
  return { $slice: [input, -resolution, +resolution] }
}

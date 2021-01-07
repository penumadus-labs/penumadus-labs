// Array.prototype.reduceToObject = function (cb, initial = {}) {
//   return this.reduce(
//     (a, value, index) => ({
//       ...a,
//       ...cb(value, index),
//     }),
//     initial
//   )
// }

module.exports.reduceToObject = function (cb, initial = {}) {
  return this.reduce(
    (a, value, index) => ({
      ...a,
      ...cb(value, index),
    }),
    initial
  )
}

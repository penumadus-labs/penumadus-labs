module.exports.reduceToObject = (array, cb, initial = {}) =>
  array.reduce(
    (a, value, index) => ({
      ...a,
      ...cb(value, index),
    }),
    initial
  )

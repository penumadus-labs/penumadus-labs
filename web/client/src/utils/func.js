export const throttle = (fn, time = 200) => {
  let timeout
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn(...args)
      }, time)
    }
  }
}

export default promise => {
  promise.done = false

  promise.then(data => {
    promise.done = true
    return data
  })

  return promise
}

const coerceNumbers = (data) => {
  for (const key in data) {
    if (!isNaN(data[key])) {
      data[key] = +data[key]
    }
  }
  return data
}

module.exports = coerceNumbers

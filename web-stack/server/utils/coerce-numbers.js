const coerceNumbers = () => {
  for (const key in obj) {
    if (!isNaN(obj[key])) {
      obj[key] = +obj[key]
    }
  }
}

const createDocument = () => ({ time: Date.now() })

const wait = (time = 1000) => new Promise((res) => setTimeout(res, time))

exports.createAccelerationEvent = (length = 40) => {
  const data = []

  for (let index = 0; index < length; index++) {
    data.push(createDocument())
  }

  return {
    time: data[0].time,
    data,
  }
}

exports.createDocuments = (nDocs, timeout = 1) =>
  Array(nDocs)
    .fill()
    .map((x, i) => ({ time: i }))

const client = require('../controllers/database')

client.wrap(async () => {
  let data = await client.getAccelerationData({})

  data = data.sort((a, b) => a.time - b.time)

  const events = []

  let prev = data[0]
  let start = data[0]
  let nPackets = 0
  let iterations = 0

  for (const d of data.slice(1)) {
    if (prev.time + 0.005 < d.time) {
      events.push({
        start: start.time,
        end: prev.time,
        nPackets,
      })
      start = d
      nPackets = 0
    }
    prev = d
    nPackets++
    iterations++
  }
})

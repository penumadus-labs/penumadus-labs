const client = require('../database/client')

const id = 'unit_3'

const testData = (data) => {
  let fails = 0
  let p
  for (const { time } of data) {
    if (p && p === time) fails++
    p = time
  }
}

client.wrap(async () => {
  const { data } = await client.devices.findOne(
    { id },
    {
      projection: {
        _id: 0,
        data: '$accelerationData',
      },
    }
  )

  // data.sort((a, b) => {
  //   const res = a.time - b.time
  //   return res
  // })

  // await client.devices.updateOne(
  //   { id },
  //   {
  //     $set: { accelerationData: data },
  //   }
  // )
})

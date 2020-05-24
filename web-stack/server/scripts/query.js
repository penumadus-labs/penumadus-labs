const { MongoClient } = require('mongodb')

const url = 'mongodb://caro:Matthew85!!@localhost/admin'

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

void (async () => {
  await client.connect()

  const queries = [
    {
      label: 'acceleration',
      field: 'accelerationData',
      projection: {
        _id: 0,
        'accelerationData.x': 1,
        'accelerationData.y': 1,
        'accelerationData.z': 1,
      },
    },
    {
      label: 'pressure',
      field: 'standardData',
      projection: {
        _id: 0,
        'standardData.pressure': 1,
      },
    },
    {
      label: 'temperatureAndHumidity',
      field: 'standardData',
      projection: {
        _id: 0,
        'standardData.temperature': 1,
        'standardData.humidity': 1,
      },
    },
  ]

  const id = 'unit_3'

  const devices = await client.db('app').collection('devices')

  // const res = await Promise.all(
  //   data.map(([label, list, ...fields]) =>
  //     devices
  //       .aggregate([
  //         { $match: { id: 'unit_3' } },
  //         { $unwind: '$' + list },
  //         {
  //           $project: fields.reduce(
  //             (acc, field) => {
  //               acc[field] = `$${list}.${field}`
  //               return acc
  //             },
  //             { _id: 0 }
  //           ),
  //         },
  //       ])
  //       .toArray()
  //   )
  // )

  const res = await Promise.all(
    queries.map(({ label, field, projection }) =>
      devices.findOne({ id }, { projection }).then((res) => res[field])
    )
  )

  console.log(res[2])
})()
  .catch(console.error)
  .finally(() => client.close().catch(console.error))

// const client = require('./client-ssh')
const client = require('../client')
const { writeFileSync } = require('fs')
const { schemas } = require('../schemas')

// const deviceSchemas = {
//   bridge: {
//     dataFields: ['environment', 'deflection', 'acceleration'],
//     configurable: false,
//   },
//   tank: {
//     dataFields: ['environment', 'acceleration'],
//     configurable: true,
//   },
// }

client.wrap(async () => {
  const id = 'morganbridge'
  for (const [field, keys] of schemas.bridge) {
    const result = await client.devices.findOne(
      { id },
      {
        projection: {
          [field]: 1,
        },
      }
    )
    const data = result[field]
    break
    // await client.updateOne(
    //   { id },
    //   {
    //     $set: {
    //       [field]: {
    //         keys,
    //         data,
    //       },
    //     },
    //   }
    // )
  }
})

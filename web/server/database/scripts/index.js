// const client = require('./client-ssh')
const client = require('../client')
const { writeFileSync } = require('fs')
const { schemas } = require('../schemas')
const { unparse } = require('papaparse')

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

const id = 'morganbridge'

const modifyFields = async () => {
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
}

const createCsv = async () => {
  const start = new Date('11-23-20').getTime() / 1000
  const end = new Date('11-24-20').getTime() / 1000
  const { data } = await client.getLinearData({
    start,
    end,
  })
  console.log(data)
}

client.wrap()

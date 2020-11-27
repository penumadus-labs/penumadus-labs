// const client = require('./client-ssh')
const client = require('../client')
const { join } = require('path')
const { writeFileSync, write } = require('fs')
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
const dest = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'save-data-from-db',
  'nov-23-20-epoxy-temperatures'
)

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
    id,
    field: 'environment',
    start,
    end,
    limit: null,
  })

  for (const d of data) {
  }

  // const csv = unparse(data)

  // writeFileSync(dest + '/deflection-data.csv', csv)
}

const test = async () => {}

client.wrap(createCsv)

const { reduce, getDataKeys } = require('./functions')

const field = 'standardData'

const limit = 1000

const reduceExpr = {
  $cond: [
    { $eq: [{ $mod: ['$$value.index', '$$step'] }, 0] },
    { $concatArrays: ['$$value.acc', ['$$this']] },
    '$$value.acc',
  ],
}

const getStandardData = (client) => async (id, start, end) => {
  const list = {
    $filter: {
      input: `$${field}`,
      cond: {
        $and: [
          { $gte: [`$$this.time`, +start] },
          { $lte: [`$$this.time`, +end] },
        ],
      },
    },
  }

  const vars = {
    step: {
      $ceil: {
        $divide: [{ $size: list }, limit],
      },
    },
  }

  const res = await client.devices.findOne(
    { id },
    {
      projection: {
        _id: 0,
        keys: getDataKeys(field),
        data: {
          $let: {
            vars,
            in: {
              $cond: [
                { $eq: ['$$step', 0] },
                [],
                reduce(`$${field}`, reduceExpr),
              ],
            },
          },
        },
      },
    }
  )

  for (const d of res.data) {
    d.pressure = Math.floor(d.pressure / 100)
  }

  return res
}

module.exports = getStandardData

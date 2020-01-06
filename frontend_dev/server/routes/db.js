const express = require('express')
const {
  createTable,
  insertRow,
  read,
  update,
  reset,
} = require('../controllers/controllers')
const wrapAsync = require('../utils/wrap-async')

const db = express.Router()

db.get(
  '/test',
  wrapAsync(async (req, res) => {
    res.send('api is working!')
  })
)

// db.post(
//   "/create-table",
//   wrapAsync(async (req, res) => {
//     await createTable()
//     res.end()
//   })
// )

// db.post(
//   "/insert-row",
//   wrapAsync(async (req, res) => {
//     await insertRow()
//     res.end()
//   })
// )

db.get(
  '/read',
  wrapAsync(async (req, res) => {
    const [data] = await read()
    res.json(data[0])
  })
)

db.post(
  '/update',
  wrapAsync(async (req, res) => {
    await update()
    res.end()
  })
)

db.post(
  '/reset',
  wrapAsync(async (req, res) => {
    await reset()
    res.end()
  })
)

module.exports = db

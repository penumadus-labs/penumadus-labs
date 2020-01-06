const mysql = require('mysql2/promise')
const q = require('./queries')

const name = 'number'

const connect = async () =>
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'example',
    port: '3306',
  })

const createTable = async () => {
  const con = await connect()
  await con.execute(q.createTable)
  con.end()
}
const insertRow = async () => {
  const con = await connect()
  await con.execute(q.insertRow(name))
  await con.end()
}
const read = async () => {
  const con = await connect()
  const result = await con.execute(q.read(name))
  await con.end()
  return result
}
const update = async () => {
  const con = await connect()
  await con.execute(q.update(name))
  await con.end()
}

const reset = async () => {
  const con = await connect()
  await con.execute(q.reset(name))
  await con.end()
}

if (require.main === module) {
  void (async function() {
    await update()
  })().catch(console.error)
}
module.exports = {
  createTable,
  insertRow,
  read,
  update,
  reset,
}

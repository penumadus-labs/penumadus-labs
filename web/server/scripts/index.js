const { join } = require('path')
const client = require('../database/client')
const { schemas } = require('../database/schemas')
const { hash } = require('bcrypt')

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

  // const csv = unparse(data)

  // writeFileSync(dest + '/deflection-data.csv', csv)
}

const getAccelerationEvent = async () => {
  const { data } = await client.getAccelerationEvent({
    id,
    index: 0,
    limit: 1000,
  })
}

const sortData = async () => {
  const { data } = await client.getLinearData({
    id,
    field: 'environment',
    limit: null,
  })

  data.sort((a, b) => a.time - b.time)

  await client.devices.updateOne({ id }, { $set: { environment: data } })
}

const createUserDocument = (username, password, admin = true) => ({
  username,
  password,
  admin,
})

const insertUsers = () =>
  Promise.all([
    ...users.map(async (user) => {
      user.password = await hash(user.password, 10)
      await client.insertUser(user)
    }),
    client.users.deleteOne({ username: 'admin' }),
  ])

const test = async () => {}

const showUsers = async () => {
  const users = await client.users.find().toArray()
  console.log(users)
}

client.wrap(showUsers)

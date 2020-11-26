const { hash } = require('bcrypt')
const client = require('./client-ssh')

const admin = {
  username: 'admin',
  password: 'p@ssw0rd',
  admin: true,
}

const user = {
  username: 'user',
  password: 'p@ssw0rd',
  admin: false,
}

client.wrap(async () => {
  for (const user of [admin, user]) {
    user.password = await hash(user.password, 10)
    // insert user
  }
})

const { hash } = require('bcrypt')
const { connect, close, wrap, insertUser } = require('../controllers/database')

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

wrap(async () => {
  for (const user of [admin, user]) {
    user.password = await hash(user.password, 10)
    await insertUser(user)
  }
})

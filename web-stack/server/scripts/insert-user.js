const { hash } = require('bcrypt')
const { connect, close, wrap, insertUser } = require('../controllers/database')

const user = {
  username: 'admin',
  password: 'p@ssw0rd',
}

wrap(async () => {
  user.password = await hash(user.password, 10)
  await insertUser(user)
})

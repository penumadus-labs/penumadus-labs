const { Router } = require('express')
const { verifyUser, signAdmin, signUser } = require('../utils/auth')
const { findUser } = require('../controllers/database')
const { compare } = require('bcrypt')

const auth = Router()

/*
connect database
encrypt passwords
return user
*/

auth.post('/login', async ({ body: { username, password } }, res) => {
  try {
    const user = await findUser(username)

    if (!user) {
      res.statusMessage = 'user not found'
      return res.sendStatus(400)
    }

    if (!(await compare(password, user.password))) {
      res.statusMessage = 'invalid password'
      return res.sendStatus(401)
    }

    const token = user.admin ? signAdmin({ username }) : signUser({ username })
    res.send({ token, admin: user.admin })
  } catch (error) {
    console.error(error)
  }
})

auth.post('/verify', verifyUser, (req, res) => {
  res.sendStatus(200)
})

module.exports = auth

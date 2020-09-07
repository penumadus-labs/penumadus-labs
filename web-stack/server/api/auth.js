const { Router } = require('express')
const { compare } = require('bcrypt')
const { verifyUser, signAdmin, signUser } = require('../utils/auth')
const { findUser } = require('../database/client')
const handleAsync = require('./handle-async')

const auth = Router()

/*
connect database
encrypt passwords
return user
*/

auth.post(
  '/login',
  handleAsync(async ({ body: { username, password } }, res) => {
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
    res.cookie('token', 'hello')
    res.send({ token, admin: user.admin })
  })
)

auth.post('/verify', verifyUser, (req, res) => {
  res.sendStatus(200)
})

module.exports = auth

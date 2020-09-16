const { Router } = require('express')
const { compare } = require('bcrypt')
const { verifyToken, signToken } = require('../utils/auth')
const { findUser } = require('../database/client')
const handleAsync = require('./handle-async')

const auth = Router()

/*
connect database
encrypt passwords
return user
*/

const oneDayInMilliseconds = 1000 * 360 * 24

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

    const token = signToken(user.admin, { username })
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: oneDayInMilliseconds,
    })
    res.sendStatus(200)
    // sessionStorage auth system
    // res.send({ token, admin: user.admin })
  })
)

auth.post('/logout', verifyToken(false), (req, res) => {
  res.cookie('token', null)
  res.sendStatus(200)
})

auth.post('/verify', verifyToken(false), (req, res) => {
  res.sendStatus(200)
})

module.exports = auth

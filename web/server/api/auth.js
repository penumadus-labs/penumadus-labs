const { Router } = require('express')
const { compare } = require('bcrypt')
const { verifyToken, signToken } = require('../utils/auth')
const { findUser } = require('../database/client')
const { handlePost } = require('./route-decorators')

/*
connect database
encrypt passwords
return user
*/

const oneDayInMilliseconds = 1000 * 360 * 24

module.exports = Router()
  .post(
    '/login',
    handlePost(async ({ username, password }, res) => {
      if (!username) return res.sendStatus(404)
      const user = await findUser(username)

      if (!user) {
        res.statusMessage = 'user not found'
        return 400
      }

      if (!(await compare(password, user.password))) {
        res.statusMessage = 'invalid password'
        return 401
      }

      const token = signToken(user.admin, { username })
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: oneDayInMilliseconds,
      })
    })
  )

  .post('/logout', verifyToken(false), (_, res) => {
    res.clearCookie('token')
    res.sendStatus(200)
  })

  .post('/verify', verifyToken(false), (_, res) => {
    res.sendStatus(200)
  })

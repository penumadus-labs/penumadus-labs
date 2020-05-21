const { Router } = require('express')
const { verifyUser, signAdmin } = require('../utils/auth')
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
      return res.send(400).send('user not found')
    }

    if (!compare(password, user.password)) {
      return res.send(401).send('invalid password')
    }

    const token = signAdmin(username)
    res.send({ token, admin: true })
  } catch (error) {
    console.error(error)
  }
})

auth.get('/verify', verifyUser, async (req, res) => {
  try {
    res.status(200)
  } catch (e) {
    console.error(e)
  }
})

module.exports = auth

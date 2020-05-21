const { Router } = require('express')
const { verifyUser, signAdmin } = require('../utils/auth')

const auth = Router()

/*
connect database
encrypt passwords
return user
*/

auth.post('/login', ({ body: { username, password } }, res) => {
  if (username === 'admin' && password === 'p@ssw0rd') {
    const token = signAdmin(username)
    return res.send({ token, admin: true })
  }
  res.status(401)
})

auth.get('/verify', verifyUser, async (req, res) => {
  try {
    res.status(200)
  } catch (e) {
    console.error(e)
  }
})

module.exports = auth

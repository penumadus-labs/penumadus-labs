const { Router } = require('express')
const authRouter = require('./auth')
const databaseRouter = require('./database')
const devicesRouter = require('./devices')
const { readTest } = require('../controllers/database')
const { verifyUser, verifyAdmin } = require('../utils/auth')

const api = Router()

api.use('/auth', authRouter)
api.use('/database', verifyUser, databaseRouter)
api.use('/devices', verifyAdmin, devicesRouter)

api.get('/test', (req, res) => {
  res.send('api is working!')
})

module.exports = api

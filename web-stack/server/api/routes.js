const { Router } = require('express')
const authRouter = require('./auth')
const databaseRouter = require('./database')
const devicesRouter = require('./devices')
const { verifyToken } = require('../utils/auth')

const api = Router()

api.use('/auth', authRouter)
api.use('/database', verifyToken(false), databaseRouter)
api.use('/devices', verifyToken(true), devicesRouter)

api.get('/test', (req, res) => {
  res.send('api is working!')
})

module.exports = api

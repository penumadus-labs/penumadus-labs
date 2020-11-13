const { join } = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const apiRouter = require('./api/routes')

const dev = !!process.env.DEV

const originList = ['http://localhost:3000', 'http://hankthetank.me:3000']
const corsConfig = {
  origin: dev ? originList : false,
  credentials: dev,
  preflightContinue: false,
}

const clientDir = join(__dirname, '..', 'client', 'build')

const test = (req, res, next) => {
  if (!dev) return next()
  next()
}

module.exports = express()
  // .use(test)
  .use(cors(corsConfig))
  .use(cookieParser())
  .use('/api', express.json(), apiRouter)
  // .use((_, res, next) => (dev ? res.sendStatus(404) : next()))
  .use(express.static(clientDir))
  .get('*', (req, res) => {
    if (!req.xhr) res.sendFile('index.html', { root: clientDir })
    else return res.sendStatus(404)
  })

const { join } = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const apiRouter = require('../api/routes')

const clientDir = join(__dirname, '..', '..', 'client', 'build')

const app = (module.exports = express())

const dev = (use, middleware) => (_, _, next) =>
  process.env.DEV === use ? middleware : next()

app
  .use(
    dev(
      true,
      cors({
        origin: ['http://localhost:3000', 'http://hankthetank.me:3000'],
        credentials: true,
        preflightContinue: false,
      })
    )
  )
  .use((req, res, next) => {
    next()
  })

app.use(cookieParser()).use('/api/', express.json(), apiRouter)

if (!process.env.DEV)
  app.use(express.static(clientDir)).get('*', (req, res) => {
    if (!req.xhr) res.sendFile('index.html', { root: clientDir })
    else return res.sendStatus(404)
  })

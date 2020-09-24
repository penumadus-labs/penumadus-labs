const { join } = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const apiRouter = require('../api/routes')

const clientDir = join(__dirname, '..', '..', 'client', 'build')

const app = express()

if (process.env.DEV)
  app
    .use(
      cors({
        origin: ['http://localhost:3000', 'http://hankthetank.me:3000'],
        credentials: true,
        preflightContinue: false,
      })
    )
    .use((req, res, next) => {
      next()
    })

module.exports = app
  .use(cookieParser())
  .use('/api', express.json(), apiRouter)
  .use(express.static(clientDir))
  .get('*', (req, res) => {
    if (!req.xhr) res.sendFile('index.html', { root: clientDir })
    else return res.sendStatus(404)
  })

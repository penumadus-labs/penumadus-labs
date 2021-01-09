const { join } = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const apiRouter = require('./api/routes')
const { json, static } = express

// const originList = ['http://localhost:3000', 'http://hankthetank.me:3000']
// const corsConfig = {
//   origin: dev ? originList : false,
//   credentials: dev,
//   preflightContinue: false,
// }

const clientDir = join(__dirname, '..', 'client', 'build')

const test = (req, res, next) => {
  next()
}

module.exports = express()
  .use(test)
  .use(cookieParser())
  .use(`/api`, json(), apiRouter)
  // .use((_, __, next) => {
  //   if (!process.env.NODE_ENV === 'development') next()
  // })
  .use(static(clientDir))
  .get('*', (req, res) => {
    if (req.accepts('text/html'))
      res.sendFile('index.html', { root: clientDir })
    else return res.sendStatus(404)
  })

const express = require('express')
const cors = require('cors')
const { resolve } = require('path')
const apiRouter = require('../api/routes')

const appPath = '../frontend/build/'
const indexPath = resolve(appPath + 'index.html')

const app = express()

if (process.env.DEV) app.use(cors())

app.use(express.static(resolve(appPath)))

// app.use('/api', apiRouter)

app.use((req, res, next) => {
  console.log('ping')
  next()
})

app.get('*', (req, res) => {
  res.send('hello')
  // if (!req.xhr) res.sendFile(indexPath)
  // else
  // res.sendStatus(404)
})

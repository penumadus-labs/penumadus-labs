const express = require('express')
const cors = require('cors')
const { resolve } = require('path')
const apiRouter = require('../api/routes')

const appPath = '../frontend/build/'
const indexPath = resolve(appPath + 'index.html')

const development = process.env.NODE_ENV === 'development'

const app = express()

if (development) app.use(cors())

app.use(express.static(resolve(appPath)))

// app.use('/api', apiRouter)

app.get('*', (req, res) => {
  if (!req.xhr) res.sendFile(indexPath)
  else res.sendStatus(404)
})

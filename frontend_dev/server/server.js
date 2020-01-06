const express = require('express')
const db = require('./routes/db')
const commands = require('./routes/commands')

const server = express()

const port = 8080

// server.use(express.static('../public'))

// for development
const cors = require('cors')
server.use(cors())

server.use('/api/db', db)
server.use('api/commands', commands)

server.listen(port, () => console.log('running on: ' + port))

const express = require('express')
const wrapAsync = require('../utils/wrap-async')
const { exec } = require('child_process')

const commands = express.Router()

const commandsPath = `${__dirname}/../commands/build/`

commands.get('/test', (req, res) => {
  exec(commandsPath + 'args', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
})

module.exports = commands

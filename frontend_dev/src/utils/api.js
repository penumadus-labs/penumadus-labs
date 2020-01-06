import axios from 'axios'

const apiURL = 'http://localhost:8080/api/'

const db = axios.create({
  baseURL: apiURL + 'db/',
})

const commands = axios.create({
  baseURL: apiURL + 'commands/',
})

export { db, commands }

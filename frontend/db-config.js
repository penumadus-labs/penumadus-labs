const options = {
  connectionDetails: {
    host: 'ubuntu@18.222.29.175',
    user: 'web_access',
    password: 'Web_Acce55!',
    database: 'tankmon',
  },
}

const example = {
  statement: 'SELECT * FROM country',
  idFieldName: 'Code',
  name: 'country',
}

const queries = [example]

module.exports = { options, queries }

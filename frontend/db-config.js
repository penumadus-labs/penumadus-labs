const dataCollected = {
  name: 'data_collected',
  statement: 'SELECT * FROM data_collected',
  idFieldName: 'id',
}

const queries = [dataCollected]

const localhost = {
  connectionDetails: {
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'db',
  },
  queries,
}

const options = {
  connectionDetails: {
    host: 'ubuntu@18.222.29.175',
    user: 'web_access',
    password: 'Web_Acce55!',
    database: 'tankmon',
  },
  queries,
}

module.exports = localhost

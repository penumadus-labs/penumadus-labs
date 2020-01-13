import React from 'react'
import useApi from '../utils/use-api'
import parseCsv from '../utils/parse-csv'

export default () => {
  let data = useApi('/data.csv')

  data = data && parseCsv(data)

  console.log(data)

  return <div>{true}</div>
}

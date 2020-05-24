import React from 'react'
import useDatabase from '../../context/database/context'
// import { makeCSVFile } from '../../utils/data'

export default () => {
  // eslint-disable-next-line
  const [{ data }] = useDatabase()

  return <button className="button">Download</button>

  // const file = makeCSVFile(data)

  // return (
  //   <a href={file} download='data'>
  //     <button className="button">Download CSV</button>
  //   </a>
  // )
}

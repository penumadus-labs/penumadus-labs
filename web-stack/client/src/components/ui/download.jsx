import React from 'react'
import { useDatabaseState } from '../../hooks/use-database'
// import { makeCSVFile } from '../../utils/data'

export default () => {
  // eslint-disable-next-line
  const { data } = useDatabaseState()

  const error = true

  if (error) return <button className='button'>Download</button>

  // const file = makeCSVFile(data)

  // return (
  //   <a href={file} download='data'>
  //     <button className="button">Download CSV</button>
  //   </a>
  // )
}

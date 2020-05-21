import React from 'react'
import Button from './button'
import { useDatabaseState } from '../../hooks/use-database'
// import { makeCSVFile } from '../../utils/data'

export default () => {
  // eslint-disable-next-line
  const { data } = useDatabaseState()

  const error = true

  if (error) return <Button>Download CSV</Button>

  // const file = makeCSVFile(data)

  // return (
  //   <a href={file} download='data'>
  //     <Button>Download CSV</Button>
  //   </a>
  // )
}

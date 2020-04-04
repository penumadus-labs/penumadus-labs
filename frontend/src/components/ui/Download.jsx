import React from 'react'
import Button from './button'
import { useDatabaseContextState } from '../../hooks/use-database-context'
import { makeCSVFile } from '../../utils/data'

export default () => {
  const { selected } = useDatabaseContextState()

  const file = selected ? makeCSVFile(selected.csv) : null

  return file ? (
    <a href={file} download="data">
      <Button>Download CSV</Button>
    </a>
  ) : (
    <Button />
  )
}

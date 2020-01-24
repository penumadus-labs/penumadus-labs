import React from 'react'
import Button from './Button.jsx'
import { useDevicesState } from '../../hooks/use-devices-context'
import { makeCSVFile } from '../../utils/csv'

export default () => {
  const { selected } = useDevicesState()

  const file = selected ? makeCSVFile(selected.csv) : null

  return file ? (
    <a href={file} download='data'>
      <Button>Download CSV</Button>
    </a>
  ) : (
    <Button />
  )
}

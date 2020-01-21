import React from 'react'
import Button from './Button.jsx'
import useAsync from '../../hooks/use-async'
import { device1 } from '../../utils/api'
import makeCSV from '../../utils/make-csv-download'

export default () => {
  const data = useAsync(device1)

  return (
    <a href={makeCSV(data)} download='data'>
      <Button>Download CSV</Button>
    </a>
  )
}

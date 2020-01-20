import React from 'react'
import Button from './Button.jsx'
import useAsync from '../../hooks/use-async'
import { csv } from '../../utils/api'
import makeCSV from '../../utils/make-csv-download'

export default () => {
  const data = useAsync(csv)

  return (
    <a href={makeCSV(data)} download='data'>
      <Button>Download CSV</Button>
    </a>
  )
}

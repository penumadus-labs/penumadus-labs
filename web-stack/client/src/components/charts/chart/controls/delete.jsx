import React from 'react'
import { VscTrash as Delete } from 'react-icons/vsc'
import Alert from '../../../alert'

export default ({ useDelete, getData, clearLiveData }) => {
  const [status, request] = useDelete()

  const handleClick = async () => {
    if (
      !window.confirm(
        'are you sure you want to remove this data from the database?'
      )
    )
      return
    await request()
    clearLiveData()
    await getData()
  }

  return (
    <Alert buttonText={<Delete size="20" />} title="clear database">
      {status}
      <button className="button" onClick={handleClick}>
        delete
      </button>
    </Alert>
  )
}

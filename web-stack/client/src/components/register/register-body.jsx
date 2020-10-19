import React from 'react'
import downloadFile from '../../utils/download-file'
import useApi from '../../api/api'

export default ({ postData }) => ({ close }) => {
  const [, , { useRegisterDevice }] = useApi()
  const [status, request] = useRegisterDevice()

  const handleConfirm = async () => {
    const { data } = await request(postData)
    downloadFile(data, `${postData.id}-config.ini`)
  }

  const summary = Object.entries(postData).map(([key, value]) => (
    <p key={key}>
      device {key}: {value}
    </p>
  ))

  return (
    <div className="space-children-y">
      {summary}
      {status}
      <div className="space-children-x">
        <button className="button button-red" onClick={close}>
          cancel
        </button>
        <button className="button button-green" onClick={handleConfirm}>
          confirm
        </button>
      </div>
    </div>
  )
}

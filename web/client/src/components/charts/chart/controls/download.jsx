import React from 'react'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import downloadFile from '../../../../utils/download-file'
import Request from './request'

export default function Download({ domainString, useDownload, downloadProps }) {
  const wrapRequest = async (request) => {
    try {
      const data = await request(...downloadProps)
      downloadFile(data, `${domainString}.csv`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Request
      buttonText={<DownloadIcon size="20" />}
      title="download selected domain"
      requestName="download"
      useRequest={useDownload}
      wrapRequest={wrapRequest}
      disabled={!domainString}
    >
      <p>{domainString ?? 'no data selected to download'}</p>
    </Request>
  )
}

import React from 'react'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import downloadFile from '../../utils/download-file'
import Request from './request'

export default function Download({
  api: { useDownload },
  reducer: [
    {
      view: { timeDomain, timeDomainString },
    },
  ],
  downloadProps,
}) {
  const wrapRequest = async (request) => {
    try {
      const data = await request(...timeDomain)
      downloadFile(data, `${timeDomainString}.csv`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Request
      buttonText={<DownloadIcon size="20" />}
      title="download data between:"
      requestName="download"
      useRequest={useDownload}
      wrapRequest={wrapRequest}
      disabled={!timeDomainString}
    >
      <p>{timeDomainString ?? 'no data selected to download'}</p>
    </Request>
  )
}

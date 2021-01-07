import React from 'react'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import downloadFile from '../../../../utils/download-file'
import Request from './request'

// export default ({
//   domain: [startTime, endTime],
//   useDownload,
//   downloadProps,
// }) => {
//   const [status, request] = useDownload()

//   const handleClick = async () => {
//     try {
//       const data = await request(...downloadProps)
//       downloadFile(data, `${startTime} - ${endTime}.csv`)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return (
//     <Alert buttonText={<Download size="20" />} title="download selected domain">
//       <p>{startTime}</p>
//       <p>{endTime}</p>
//       {status}
//       <button className="button" onClick={handleClick}>
//         download
//       </button>
//     </Alert>
//   )
// }

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
    >
      <p>{domainString}</p>
    </Request>
  )
}

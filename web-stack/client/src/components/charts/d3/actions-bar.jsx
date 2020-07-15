import React, { useState } from 'react'
import styled from '@emotion/styled'
import { GoGear } from 'react-icons/go'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import Alert, { useAlert } from '../../alerts/alert'
import Download from '../../forms/chart-download'
import ChartSettings from '../../forms/chart-settings'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data, getDomain }) => {
  const [openSettings, bindSettings] = useAlert()
  const [openDownload, bindDownload] = useAlert()

  const [times, setTimes] = useState({})

  return (
    <>
      <StyledDiv className="space-children-x">
        <button className="button" onClick={openDownload}>
          <DownloadIcon size="20" />
        </button>
        <button className="button" onClick={openSettings}>
          <GoGear size="20" />
        </button>
      </StyledDiv>
      <Alert {...bindSettings} title="select time domain">
        <ChartSettings times={times} setTimes={setTimes} />
      </Alert>
      <Alert {...bindDownload} title="download seleted domain">
        <Download getDomain={getDomain} />
      </Alert>
    </>
  )
}

import React, { useState } from 'react'
import styled from '@emotion/styled'
import { GoGear } from 'react-icons/go'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import {
  FiHelpCircle as Help,
  FiVideo as Live,
  FiVideoOff as LiveOff,
} from 'react-icons/fi'
import Alert, { useAlert } from '../../alerts/alert'
import Download from './chart-download'
import ChartSettings from './chart-settings'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

const help = (
  <>
    <p>use the gear to set the display domain</p>
    <p>use the download button to get the current view as a csv</p>
    <p>click the camera to toggle live data collection</p>
    <br />
    <p>click the chart drag to select an area of the chart</p>
    <p>use apply to expand that area</p>
    <p>use undo to undo previous brush</p>
    <p>use reset to return to default view</p>
  </>
)

export default ({ live, handleLive, downloadProps, settingsProps }) => {
  const [openSettings, bindSettings] = useAlert()
  const [openDownload, bindDownload] = useAlert()
  const [openHelp, bindHelp] = useAlert()

  const intervalState = useState({ start: '', end: '' })

  return (
    <>
      <StyledDiv className="space-children-x">
        <button className="button" onClick={openSettings}>
          <GoGear size="20" />
        </button>
        <button className="button" onClick={openDownload}>
          <DownloadIcon size="20" />
        </button>
        <button className="button" onClick={openHelp}>
          <Help size="20" />
        </button>
        <button className="button" onClick={handleLive}>
          {live ? <LiveOff size="20" /> : <Live size="20" />}
        </button>
      </StyledDiv>

      <Alert {...bindSettings} title="select time domain">
        <ChartSettings {...settingsProps} intervalState={intervalState} />
      </Alert>
      <Alert {...bindDownload} title="download seleted domain">
        <Download {...downloadProps} />
      </Alert>
      <Alert {...bindHelp}>{help}</Alert>
    </>
  )
}

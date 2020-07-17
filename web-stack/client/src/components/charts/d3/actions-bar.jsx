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
import Download from '../../forms/chart-download'
import ChartSettings from '../../forms/chart-settings'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data, getDomain, live, handleLive }) => {
  const [openSettings, bindSettings] = useAlert()
  const [openDownload, bindDownload] = useAlert()
  const [openHelp, bindHelp] = useAlert()

  const [times, setTimes] = useState({})

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
          {live ? <Live size="20" /> : <LiveOff size="20" />}
        </button>
      </StyledDiv>
      <Alert {...bindSettings} title="select time domain">
        <ChartSettings times={times} setTimes={setTimes} />
      </Alert>
      <Alert {...bindDownload} title="download seleted domain">
        <Download getDomain={getDomain} />
      </Alert>
      <Alert {...bindHelp}>
        <p>use the gear to set the display domain</p>
        <p>use the download button to get the current view as a csv</p>
        <p>click the camera to toggle live data collection</p>
        <br/>
        <p>click the chart drag to select an area of the chart</p>
        <p>use apply to expand that area</p>
        <p>use undo to undo previous brush</p>
        <p>use reset to return to default view</p>
      </Alert>
    </>
  )
}

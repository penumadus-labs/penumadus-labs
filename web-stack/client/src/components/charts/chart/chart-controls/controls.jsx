import React from 'react'
import styled from '@emotion/styled'
import { FaFileDownload as DownloadIcon } from 'react-icons/fa'
import {
  FiHelpCircle as Help,
  FiVideo as Live,
  FiVideoOff as LiveOff,
} from 'react-icons/fi'
import Download from './chart-download'
import help from './help'
import Alert, { useAlert } from '../../../alerts/alert'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({
  live,
  toggleLive,
  downloadProps,
  settingsProps,
  children = () => null,
}) => {
  const [openDownload, bindDownload] = useAlert()
  const [openHelp, bindHelp] = useAlert()


  return (
    <>
      <StyledDiv className="space-children-x">
        <button className="button" onClick={openDownload}>
          <DownloadIcon size="20" />
        </button>
        <button className="button" onClick={openHelp}>
          <Help size="20" />
        </button>
        <button className="button" onClick={toggleLive}>
          {live ? <LiveOff size="20" /> : <Live size="20" />}
        </button>
        {children(live)}
      </StyledDiv>
      <Alert {...bindDownload} title="download seleted domain">
        <Download {...downloadProps} />
      </Alert>
      <Alert {...bindHelp}>{help}</Alert>
    </>
  )
}

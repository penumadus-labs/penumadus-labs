import React from 'react'
import styled from '@emotion/styled'
import { GoGear } from 'react-icons/go'
import { FaFileDownload as Download } from 'react-icons/fa'
import Settings, { useAlert as useSettingsAlert } from '../../alerts/settings'
import Alert, { useAlert } from '../../alerts/alert'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data }) => {
  const [openSettings, bindSettings] = useSettingsAlert()
  const [openDownload, bindDownload] = useAlert()

  return (
    <StyledDiv className="space-children-x">
      <button className="button" onClick={openDownload}>
        <Download size="20" />
      </button>
      <button className="button" onClick={openSettings}>
        <GoGear size="20" />
      </button>
      <Settings {...bindSettings} />
      <Alert {...bindDownload}>:(</Alert>
    </StyledDiv>
  )
}

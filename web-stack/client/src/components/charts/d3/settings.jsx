import React from 'react'
import styled from '@emotion/styled'
import { GoGear } from 'react-icons/go'
import { FaFileDownload as Download } from 'react-icons/fa'
import ChartSettings from '../../forms/chart-settings'
import Alert, { useAlert } from '../../alerts/alert'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
`

export default ({ data }) => {
  const [openSettings, bindSettings] = useAlert()
  const [openDownload, bindDownload] = useAlert()

  return (
    <>
      <StyledDiv className="space-children-x">
        <button className="button" onClick={openDownload}>
          <Download size="20" />
        </button>
        <button className="button" onClick={openSettings}>
          <GoGear size="20" />
        </button>
      </StyledDiv>
      <Alert {...bindSettings}>
        <ChartSettings />
      </Alert>
      <Alert {...bindDownload}>:(</Alert>
    </>
  )
}

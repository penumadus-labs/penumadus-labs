import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import Controls from './controls'
import useChart from './route-decorators/use-chart'
import Legend from './legend'
import Tools from './tools'
import useApi from '../../../api'
import useMessage from '../../../services/socket'

const SvgStyle = css`
  svg {
    text {
      fill: var(--font);
    }
    .axis {
      path,
      line {
        stroke: var(--font);
      }
    }
  }
`

const StyledSVG = styled.svg`
  width: 100%;
  height: 650px;
`

const ControlBarStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  > * {
    margin-bottom: var(--xs);
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export default ({
  children,
  render,
  dataLabel,
  data: [status, { noDataCollected, data } = {}],
  getData,
  useDownload,
  useDelete,
  downloadProps,
  initializeLive,
  handleMutation,
  ...props
}) => {
  if (status) return status

  const [, { mutateStore }] = useApi()

  const [live, setLive] = useState(localStorage.getItem('live') === 'true')
  const toggleLive = async () => {
    if (!live) await initialize()
    localStorage.setItem('live', !live)
    setLive(!live)
  }

  useMessage(({ type, data: messageData }) => {
    if (live && type !== dataLabel) return
    mutateStore(dataLabel, (store) => {
      const [status, { data }] = store
      return [status, { data: handleMutation(messageData, data) }]
    })
  })

  const {
    ref,
    date,
    domain,
    defaultDownloadProps,
    toolProps,
    labels,
  } = useChart({
    data,
    ...props,
  })

  if (noDataCollected)
    return (
      <div className="card">
        <p>no data has been collected for this unit</p>
      </div>
    )

  const controlProps = {
    downloadProps: {
      downloadProps: downloadProps ?? defaultDownloadProps,
      domain,
      useDownload,
    },
    deleteProps: {
      useDelete,
      getData,
    },
    liveProps: {
      live,
      toggleLive,
    },
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <Header>
        <p>{date}</p>
      </Header>
      <ControlBarStyle>
        <Controls {...controlProps} render={render}>
          {children}
        </Controls>
        {!live ? <Tools {...toolProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={ref} />
      <Legend labels={labels} />
    </div>
  )
}

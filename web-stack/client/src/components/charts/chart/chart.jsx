import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import Controls from './controls'
import useChart from './helpers/use-chart'
import useLive from './helpers/use-live'
import Legend from './legend'
import Tools from './tools'

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
  data: [status, { noDataCollected, data: collectedData } = {}],
  getData,
  useDownload,
  useDelete,
  downloadProps,
  initializeLive,
  handleLive,
  ...props
}) => {
  if (status) return status

  const [data, liveProps, { clearLiveData }] = useLive(
    collectedData,
    initializeLive,
    handleLive
  )

  const noData = noDataCollected && data.length === 0

  const {
    ref,
    date,
    domain,
    defaultDownloadProps,
    toolProps,
    labels,
  } = useChart({
    data,
    noData,
    ...props,
  })

  console.log(data)

  if (noData)
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
      clearLiveData,
    },
    liveProps,
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
        {!liveProps.live ? <Tools {...toolProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={ref} />
      <Legend labels={labels} />
    </div>
  )
}

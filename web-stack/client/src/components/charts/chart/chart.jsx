import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import Controls from './controls'
import useChart from './helpers/use-chart'
import useLive from './helpers/use-live'
import Legend from './legend'
import Navigator from './navigator'
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
  data: [status, { keys, data: storedData } = {}],
  useDownload,
  useDelete,
  downloadProps,
  initializeLive,
  handleLive,
  ...props
}) => {
  if (status) return status
  if (!keys)
    return (
      <div className="card">
        <p>no data has been collected for this unit</p>
      </div>
    )
  const [data, liveProps] = useLive(storedData, initializeLive, handleLive)
  const { ref, date, domain, defaultDownloadProps, toolProps } = useChart({
    keys,
    data,
    ...props,
  })

  const controlProps = {
    downloadProps: {
      downloadProps: downloadProps ?? defaultDownloadProps,
      domain,
      useDownload,
    },
    deleteProps: {
      useDelete,
    },
    liveProps,
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <Header>
        <p>{date}</p>
        <Navigator />
      </Header>
      <ControlBarStyle>
        <Controls {...controlProps} render={render}>
          {children}
        </Controls>
        {!liveProps.live ? <Tools {...toolProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={ref} />
      <Legend labels={keys} />
    </div>
  )
}

import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import React from 'react'
import Controls from './controls'
import useChart from './helpers/use-chart'
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
  height: ${(window.innerHeight * 11) / 16}px;
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
  live,
  toggleLive,
  getData,
  useDownload,
  useDelete,
  downloadProps,
  render,
  children,
  ...props
}) => {
  const {
    ref,
    date,
    domain,
    defaultDownloadProps,
    toolProps,
    labels,
  } = useChart(props)

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
          {typeof render === 'function' ? render(live) : children}
        </Controls>
        {!live ? <Tools {...toolProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={ref} />
      <Legend labels={labels} />
    </div>
  )
}

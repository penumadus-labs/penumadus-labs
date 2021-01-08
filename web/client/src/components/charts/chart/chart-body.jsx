import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Controls from './controls'
import Legend from './legend'
import Tools from './tools'
import Chart from './d3-linechart'
import { useResize } from '@web/hooks/use-events'

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
  min-height: 800px;
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

export default function ChartBody({
  live,
  toggleLive,
  downloadProps,
  getData,
  useDownload,
  useDelete,
  render,
  children,
  data,
  yDomain,
}) {
  const svgRef = useRef()

  const [[domain, parsedTime], setDomain] = useState([[0, 0], ''])
  const domainString = data.length ? parsedTime : null

  const { chart, getDomain, toolProps, labels } = useMemo(() => {
    const chart = new Chart({ data, yDomain })
    const { getDomain } = chart

    setDomain(getDomain())

    return {
      chart,
      getDomain,
      toolProps: chart.getToolProps(),
      labels: chart.getLabels(),
    }
  }, [data, yDomain])

  useEffect(() => chart.mount(svgRef.current), [chart])

  const containerRef = useResize(({ current }) => {
    const main = document.querySelector('main')
    const targetHeight = Math.floor(
      main.getBoundingClientRect().height -
        parseInt(getComputedStyle(main).padding) * 2
    )

    const increment = 10

    let x = 0
    svgRef.current.style.height = '200px'
    while (current.getBoundingClientRect().height + increment < targetHeight) {
      const height = svgRef.current.getBoundingClientRect().height + increment
      svgRef.current.style.height = `${height}px`
      if (x++ > 500) break // safety
    }

    chart.render()
  }) // grows svg until the root node's height fill's the app's body

  const controlProps = {
    downloadProps: {
      downloadProps: downloadProps ?? domain,
      domainString,
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

  for (const [key, action] of Object.entries(toolProps)) {
    toolProps[key] = () => {
      action()
      setDomain(getDomain())
    }
  }

  return (
    <div className="card-spaced" ref={containerRef}>
      <Global styles={SvgStyle} />
      <div className="space-children-y">
        <p>{domainString ?? 'no data within range'}</p>
        <ControlBarStyle>
          <Controls {...controlProps} render={render}>
            {typeof render === 'function' ? render({ live, domain }) : children}
          </Controls>
          {!live ? <Tools {...toolProps} /> : null}
        </ControlBarStyle>
      </div>
      <StyledSVG ref={svgRef} />
      <Legend labels={labels} />
    </div>
  )
}

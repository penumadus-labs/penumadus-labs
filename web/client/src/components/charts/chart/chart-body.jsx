import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Controls from './controls'
import Legend from './legend'
import Tools from './tools'
import Chart from './d3-linechart'
import { useResize } from '../../../hooks/use-events'

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

export default ({
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
}) => {
  const svgRef = useRef()

  const [[domain, domainString], setDomain] = useState([[0, 0], ''])

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
      svgRef.current.style.height = `${
        svgRef.current.getBoundingClientRect().height + increment
      }px`
      if (x++ > 500) break
    }

    chart.render()
  })

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

  for (const [key, fn] of Object.entries(toolProps)) {
    toolProps[key] = () => {
      fn()
      setDomain(getDomain())
    }
  }

  return (
    <div className="card-spaced" ref={containerRef}>
      <Global styles={SvgStyle} />
      <div className="space-children-y">
        <p>{domainString}</p>
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

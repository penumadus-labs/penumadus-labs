import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import Chart from './d3'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/core'

import Legend from './legend'
import Controls from './brush-controls'
import Settings from './settings'

import * as colors from '../../../utils/colors'

const options = { year: 'numeric', month: 'long', day: 'numeric' }

const units = {
  humidity: 'H',
  temperature: 'C',
  pressure: 'P',
}

const lineColors = {
  humidity: colors.blue,
  pressure: colors.green,
  temperature: colors.red,
}

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

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--sm);
`

let timeout

export default ({ data }) => {
  if (!Object.values(data).length)
    return (
      <div className="card">
        <p>no data to display</p>
      </div>
    )
  const rootRef = useRef()
  const chart = useMemo(() => new Chart({ data, colors: lineColors }), [data])
  const [tool, setTool] = useState('brush')

  const applyBrush = () => chart.applyBrush()
  const undo = () => chart.undo()
  const reset = () => chart.reset()

  const resize = useCallback(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      chart.mount()
    }, 250)
  }, [chart])

  useEffect(() => {
    chart.mount(rootRef.current)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      chart.clean()
    }
  }, [rootRef, chart, resize])

  useEffect(() => {
    chart.setTool(tool)
  }, [chart, tool])

  const date = new Date(data.humidity[0].time * 1000).toLocaleDateString(
    undefined,
    options
  )

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <p>{date}</p>
      <ControlBar>
        <div></div>
        <Controls {...{ applyBrush, undo, reset, tool, setTool }} />
        <Settings {...{ data }} />
      </ControlBar>
      <StyledSVG ref={rootRef} />
      <Legend labels={Object.keys(data)} colors={lineColors} units={units} />
    </div>
  )
}

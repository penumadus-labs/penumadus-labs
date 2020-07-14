import React, { useRef, useEffect, useState, useMemo } from 'react'
import Chart from './d3-linechart'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/core'
import { extent } from 'd3'

import Legend from './legend'
import BrushControls from './brush-controls'
import ActionsBar from './actions-bar'

import * as colors from '../../../utils/colors'
import { parseDate } from '../../../utils/datetime'

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
  // if (!Object.values(data).length)
  //   return (
  //     <div className="card">
  //       <p>no data to display</p>
  //     </div>
  //   )

  const [chart, date] = useMemo(() => {
    const chart = new Chart({ data, colors: lineColors })

    const [start, end] = extent(data.humidity.map((d) => d.time))

    const date =
      start && end
        ? `${parseDate(start)} - ${parseDate(end)}`
        : 'no data within range'

    return [chart, date]
  }, [data])

  const rootRef = useRef()
  const [tool, setTool] = useState('brush')

  useEffect(() => {
    const resize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        chart.mount()
        chart.setTool(tool)
      }, 250)
      // eslint-disable-next-line
    }
    chart.mount(rootRef.current)
    chart.setTool(tool)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      chart.clean()
    }
    // eslint-disable-next-line
  }, [chart])

  const applyBrush = () => chart.applyBrush()
  const undo = () => chart.undo()
  const reset = () => chart.reset()
  const getDomain = () => chart.getDomain()

  const changeTool = (tool) => {
    chart.setTool(tool)
    setTool(tool)
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <p>{date}</p>
      <ControlBar>
        <div></div>
        <BrushControls {...{ applyBrush, undo, reset, tool, changeTool }} />
        <ActionsBar {...{ data, getDomain }} />
      </ControlBar>
      <StyledSVG ref={rootRef} />
      <Legend labels={Object.keys(data)} colors={lineColors} units={units} />
    </div>
  )
}

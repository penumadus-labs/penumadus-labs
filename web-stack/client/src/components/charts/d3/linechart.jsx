import React, { useRef, useEffect, useState, useMemo } from 'react'
import Chart from './d3-linechart'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/core'
import { extent } from 'd3'

import Legend from './legend'
import BrushControls from './brush-controls'
import ActionsBar from './actions-bar'

import useMessage from '../../../context/socket/context'
import useDatabase from '../../../context/database/context'

import { parseDate } from '../../../utils/datetime'
import * as c from '../../../utils/colors'


const colors = {
  humidity: c.blue,
  pressure: c.green,
  temperature: c.red,
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

const defaultTool = 'brush'

export default ({ data }) => {
  const [, { getStandardData }] = useDatabase()

  const rootRef = useRef()
  const [tool, setTool] = useState(defaultTool)
  const [live, setLive] = useState(false)

  const [chart, date] = useMemo(() => {
    const chart = new Chart({ data, colors })

    const [start, end] = extent(data.humidity.map((d) => d.time))

    const date =
      start && end
        ? `${parseDate(start)} - ${parseDate(end)}`
        : 'no data within range'

    return [chart, date]
    // eslint-disable-next-line
  }, [data])

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

  useMessage(
    (data) => {
      if (live) getStandardData().catch(console.error)
    },
    [live]
  )

  const applyBrush = () => chart.applyBrush()
  const undo = () => chart.undo()
  const reset = () => chart.reset()
  const getDomain = () => chart.getDomain()

  const changeTool = (tool) => {
    chart.setTool(tool)
    setTool(tool)
  }

  const handleLive = () => {
    if (live) {
      setLive(false)
      changeTool(defaultTool)
    } else {
      setLive(true)
      changeTool(null)
    }
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <p>{date}</p>
      <ControlBar>
        <button className="button" onClick={handleLive}>
          {live ? 'disable' : 'enable'} live mode
        </button>
        {!live ? (
          <BrushControls {...{ applyBrush, undo, reset, tool, changeTool }} />
        ) : null}
        <ActionsBar {...{ data, getDomain }} />
      </ControlBar>

      <StyledSVG ref={rootRef} />
      <Legend labels={Object.keys(data)} colors={colors} />
    </div>
  )
}

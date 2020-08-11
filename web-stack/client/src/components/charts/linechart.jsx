import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { extent } from 'd3'
import Chart from './linechart'

import Legend from './legend'
import BrushControls from './brush-controls'
import ControlBar from './chart-controls/controls'

import useMessage from '../../services/socket'
import { parseDate } from './datetime'
import * as c from '../../style/colors'

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

const ControlBarStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  > * {
    margin-bottom: var(--xs);
  }
`

let timeout

const defaultTool = 'brush'

export default ({
  state: [status, data],
  intervalDeps,
  useDownload,
  useGetData,
  getData,
}) => {
  if (status) return status
  if (!data) return null

  const rootRef = useRef()
  const [tool, setTool] = useState(defaultTool)
  const [live, setLive] = useState(false)

  const [chart, date] = useMemo(() => {
    if (!data) return []
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
      if (live) getData({}, true).catch(console.error)
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

  const downloadProps = {
    getDomain,
    useDownload,
  }

  const settingsProps = {
    useGetData,
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <p>{date}</p>
      <ControlBarStyle>
        <ControlBar {...{ live, handleLive, downloadProps, settingsProps }} />
        {!live ? (
          <BrushControls {...{ applyBrush, undo, reset, tool, changeTool }} />
        ) : null}
      </ControlBarStyle>
      <StyledSVG ref={rootRef} />
      <Legend labels={Object.keys(data)} colors={colors} />
    </div>
  )
}

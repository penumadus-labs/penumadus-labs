import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import { extent } from 'd3'
import Chart from './linechart'
import Legend from './legend'
import Controls from './chart-controls/controls'
import BrushControls from './brush-controls'
import { parseDate } from '../datetime'
import { colors } from '../units-colors'
import useMessage from '../../../services/socket'

const defaultTool = 'brush'

export const useChart = ({
  keys,
  data: apiData,
  useDownload,
  liveModeSet,
  liveModeAction,
}) => {
  const chartRef = useRef()
  const [tool, setTool] = useState(defaultTool)
  const [live, setLive] = useState(false)
  const [liveData, setLiveData] = useState(null)

  const data = live ? liveData : apiData

  const [chart, date] = useMemo(() => {
    if (!data) return []
    const chart = new Chart({ keys, data, colors })

    const [start, end] = extent(data.map((d) => d.time))

    const date =
      start && end
        ? `${parseDate(start)} - ${parseDate(end)}`
        : 'no data within range'

    return [chart, date]
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    let timeout
    const resize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        chart.mount()
        chart.setTool(tool)
      }, 250)
      // eslint-disable-next-line
    }
    chart.mount(chartRef.current)
    chart.setTool(tool)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      chart.clean()
    }
    // eslint-disable-next-line
  }, [chart])

  useMessage(
    (ctx) => {
      if (live) liveModeAction({ setLiveData, ...ctx })
    },
    [live]
  )

  const toggleLive = async () => {
    if (live) {
      setLive(false)
      changeTool(defaultTool)
    } else {
      const { data } = await liveModeSet()
      setLiveData(data)
      setLive(true)
      changeTool(null)
    }
  }

  const changeTool = (tool) => {
    chart.setTool(tool)
    setTool(tool)
  }

  const state = {
    chartRef,
    live,
    date,
  }

  const brushControlsProps = {
    applyBrush: () => chart.applyBrush(),
    undo: () => chart.undo(),
    reset: () => chart.reset(),
    tool,
    changeTool,
  }

  const controlsProps = {
    live,
    toggleLive,
    downloadProps: {
      getDomain: () => chart.getDomain(),
      useDownload,
    },
  }

  const props = {
    brushControlsProps,
    controlsProps,
  }

  return [state, props]
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

export default ({ children, ...props }) => {
  const [
    { chartRef, date, live },
    { brushControlsProps, controlsProps },
  ] = useChart(props)

  const { keys } = props

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <p>{date}</p>
      <ControlBarStyle>
        <Controls {...controlsProps}>{children}</Controls>
        {!live ? <BrushControls {...brushControlsProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={chartRef} />
      <Legend labels={keys} />
    </div>
  )
}

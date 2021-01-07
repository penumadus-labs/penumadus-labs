import React, { useState, useEffect, useMemo, useRef } from 'react'
import Chart from './d3-linechart'

const StyledSVG = styled.svg`
  width: 100%;
  min-height: 800px;
`

export default function useChart() {
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
}

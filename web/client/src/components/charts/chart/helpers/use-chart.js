import { useEffect, useMemo, useRef } from 'react'
import Chart from './d3-linechart'

export default ({ noDataCollected, ...props }) => {
  const ref = useRef()

  const { chart, ...ctx } = useMemo(() => {
    if (noDataCollected) return {}
    const chart = new Chart(props)

    return {
      chart,
      date: chart.date(),
      domain: chart.getDomainParsed(),
      defaultDownloadProps: chart.getDomain(),
      toolProps: chart.getToolProps(),
      labels: chart.getLabels(),
    }

    // eslint-disable-next-line
  }, [props.data])

  useEffect(
    () => {
      if (chart) return chart.mount(ref.current)
    },
    // eslint-disable-next-line
    [chart]
  )

  return { ...ctx, ref }
}

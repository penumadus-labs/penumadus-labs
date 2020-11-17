import { useEffect, useMemo, useRef } from 'react'
import Chart from './d3-linechart'

export default ({ noData, ...props }) => {
  const ref = useRef()

  const { chart, ...ctx } = useMemo(() => {
    if (noData) return {}
    const chart = new Chart(props)

    return {
      chart,
      date: chart.date(),
      domain: chart.getDomainParsed(),
      defaultDownloadProps: chart.getDomain(),
      toolProps: chart.getToolProps(),
    }

    // eslint-disable-next-line
  }, [props.data, props.keys])

  useEffect(
    () => {
      if (chart) chart.mount(ref.current)
    },
    // eslint-disable-next-line
    [chart]
  )

  return { ...ctx, ref }
}

import { useEffect, useMemo, useRef } from 'react'
import Chart from './d3-linechart'

export default (props) => {
  const ref = useRef()

  console.log(props.data)

  const { chart, ...ctx } = useMemo(() => {
    const chart = new Chart(props)

    return {
      chart,
      date: chart.date(),
      domain: chart.getDomainParsed(),
      defaultDownloadProps: chart.getDomain(),
      toolProps: chart.getToolProps(),
    }

    // eslint-disable-next-line
  }, [props.data])

  useEffect(
    () => chart.mount(ref.current),
    // eslint-disable-next-line
    [chart]
  )

  return { ...ctx, ref }
}

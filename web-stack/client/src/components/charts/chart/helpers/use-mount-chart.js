import { useEffect, useMemo, useRef } from 'react'
import Chart from './d3-linechart'

export default (props) => {
  const ref = useRef()
  const { data } = props

  const [chart, date] = useMemo(() => {
    if (!data) {
      console.info("there wasn't data")
      return []
    }
    const chart = new Chart(props)
    const date = chart.date()

    return [chart, date]
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    return chart.mount(ref.current)
    // eslint-disable-next-line
  }, [chart])

  return { ref, date, chart }
}

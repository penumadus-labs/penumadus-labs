import { brushHeight, margin } from './size'

const brushGroupTopOffset = margin.bottom + brushHeight
const chartHeightOffset =
  margin.top + margin.center + brushHeight + margin.bottom

export const setRange = ({ scales }, { width, height }) => {
  const innerWidth = width - margin.x
  const chartHeight = height - chartHeightOffset
  const groupTop = height - brushGroupTopOffset

  for (const scale of Object.values(scales.x)) {
    scale.range([0, innerWidth])
  }
  for (const scale of Object.values(scales.y)) {
    scale.range([0, chartHeight])
  }
  return { innerWidth, groupTop }
}

const setDomainInfo = (timeDomain) => ({
  timeDomain,
  timeDomainString: timeDomain.toString(),
})

export const brushData = ({ initialData }, { x0, x1 }) => {
  return x0 && x1
    ? initialData.filter(({ time }) => x0 < time && time < x1)
    : initialData
}

export const brushDomain = (data, { scales }) => {
  const timeDomain = getDomainTime(data)
  scales.x.time.domain(timeDomain)
  return setDomainInfo(timeDomain)
}

export const setDomain = (data) => {
  const domainTime = getDomainTime(data)

  for (const scale of Object.values(scales.x)) {
    scale.domain(domainTime)
  }
  for (const scale of Object.values(scales.y)) {
    scale.domain([0, chartHeight])
  }
  return setDomainInfo(timeDomain)
}

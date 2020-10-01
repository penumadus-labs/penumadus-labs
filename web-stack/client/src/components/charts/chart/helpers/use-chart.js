import useLive from './use-live'
import useMountChart from './use-mount-chart'

export default ({
  keys,
  data: apiData,
  useDownload,
  useDelete,
  liveModeSet,
  liveModeAction,
  yDomain,
  downloadProps,
}) => {
  const [data, liveProps] = useLive({ liveModeSet, liveModeAction, apiData })

  const { chart, ...res } = useMountChart({ keys, data, yDomain })

  const chartProps = {
    live: liveProps.live,
    ...res,
  }

  const controlProps = {
    downloadProps: {
      downloadProps: downloadProps ?? chart.getDomain(),
      domain: chart.getDomainParsed(),
      useDownload,
    },
    deleteProps: {
      useDelete,
    },
    liveProps,
  }

  const toolProps = chart.getToolProps()

  return [chartProps, controlProps, toolProps]
}

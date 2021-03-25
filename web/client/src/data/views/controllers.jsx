import { Chart } from './view'
import { Delete, Download, Help, Live } from '../controllers'
import { useChartReducer } from '../model/reducer'

export const Controls = ({ label, data, api }) => {
  // this useChartReducer current only works if data isn't null
  // that's why controls is in a separate component
  // so useChartReducer can be used conditionally with data
  // control's parent component returns null if data is undefined
  const reducer = useChartReducer({ label, data })

  const [
    {
      view: { timeDomainString },
    },
  ] = reducer

  return (
    <>
      <div className="space-children-x center-children-vertically">
        <Delete api={api} />
        <Download api={api} reducer={reducer} />
        <Live reducer={reducer} />
        <Help />
        <p>{timeDomainString}</p>
      </div>
      <Chart label={label} data={data} reducer={reducer} />
    </>
  )
}

import React from 'react'
import axios from 'axios'
import papa from 'papaparse'

import LineGraph from './LineGraph'
import makeDataSets from '../utils/make-data-sets'

class GraphWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { dataSets: null }
  }

  async componentDidMount() {
    const resps = await Promise.all([
      axios.get('/tank.csv'),
      axios.get('/Data.csv'),
    ])

    const [data] = resps.map(({ data }) => papa.parse(data).data).slice(1)

    const dataSets = makeDataSets(data)

    this.setState({ dataSets })
  }
  render() {
    if (this.state.dataSets) {
      const { hum, temp } = this.state.dataSets
      return (
        <>
          <LineGraph data={hum.data} dataKey={hum.key} />
          <LineGraph data={temp.data} dataKey={temp.key} />
        </>
      )
    }
    return null
  }
}

export default GraphWrapper

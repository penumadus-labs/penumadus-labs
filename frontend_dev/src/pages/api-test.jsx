import React from 'react'
import Btn from '../components/Btn'
import { db } from '../utils/api'

// const timer = () => new Promise(res => setTimeout(res, 1000))

class ApiTest extends React.Component {
  constructor() {
    super()
    this.state = { apiState: 'fetching data...', value: null }
  }
  async increment() {
    await db.post('update')
    await this.setValue()
  }
  async reset() {
    await db.post('reset')
    await this.setValue()
  }
  async setValue() {
    const {
      data: { value },
    } = await db.get('read')
    this.setState({ value })
  }
  async componentDidMount() {
    const { data } = await db.get('test')

    this.setState({ apiState: data })

    await this.setValue()
  }
  render() {
    const { value, apiState } = this.state
    return (
      <div>
        <p>{apiState}</p>
        {value !== null ? (
          <>
            <p>{value}</p>
            <Btn onClick={() => this.increment()}>++</Btn>
            <Btn onClick={() => this.reset()}>reset</Btn>
          </>
        ) : null}
      </div>
    )
  }
}

export default ApiTest

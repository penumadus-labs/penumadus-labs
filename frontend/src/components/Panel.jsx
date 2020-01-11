import React from 'react'
import Btn from './Button.jsx'

class Panel extends React.Component {
  render() {
    const { title } = this.props
    return (
      <div>
        <h3>{title}</h3>
        <div>
          <label>
            label:
            <input></input>
          </label>
          <br />
          <br />
          <Btn>update</Btn>
        </div>
      </div>
    )
  }
}

export default Panel

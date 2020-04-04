import React from 'react'
import Button from './button'

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
          <Button>update</Button>
        </div>
      </div>
    )
  }
}

export default Panel

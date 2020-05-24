import React from 'react'

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
          <button className="button">update</button>
        </div>
      </div>
    )
  }
}

export default Panel

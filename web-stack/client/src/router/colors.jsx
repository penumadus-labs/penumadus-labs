import React from 'react'
import * as colors from '../utils/colors'

export default () => {
  return (
    <div className="grid-4">
      {Object.entries(colors).map(([name, color], i) => (
        <div key={i} style={{ height: '50px', background: color }}>
          <p>{name}</p>
        </div>
      ))}
    </div>
  )
}

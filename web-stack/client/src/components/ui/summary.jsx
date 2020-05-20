import React from 'react'
import Alert from './alert'

export default ({ list, onAccept, onCancel }) => (
  <Alert onAccept={onAccept} onCancel={onCancel}>
    <p>summary</p>
    {list.map(({ name, value, current, unit }) => {
      return value === '' ? null : (
        <p key={name}>
          {name}: {current + unit} => {value + unit}
        </p>
      )
    })}
  </Alert>
)

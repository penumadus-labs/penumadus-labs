import React from 'react'

export default ({ message = '404: invalid route' }) => (
  <p className="main card">{message}</p>
)

import React from 'react'
import Card from './card'

export default ({ children = 'caught error' }) => {
  return (
    <Card>
      <p>{children}</p>
    </Card>
  )
}

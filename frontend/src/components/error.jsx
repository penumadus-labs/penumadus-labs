import React from 'react'
import Card from './card'
import Warning from './warning'

export default ({ children = 'caught error' }) => {
  return (
    <Card>
      <Warning>{children}</Warning>
    </Card>
  )
}

import styled from '@emotion/styled'
import React from 'react'
import * as colors from '../utils/colors'

const Root = styled.div`
  p {
    padding: var(--md);
    text-align: center;
    border: 1px solid black;
  }
`

export default function Colors() {
  return (
    <Root className="grid-4">
      {Object.entries(colors).map(([name, color], i) => (
        <p
          key={i}
          style={{
            background: color,
          }}
        >
          {name}
        </p>
      ))}
    </Root>
  )
}

import styled from '@emotion/styled'
import React from 'react'

const Controls = styled.div`
  display: flex;
  justify-content: center;
`

export default function ChartTools({ applyBrush, undo, reset }) {
  return (
    <Controls className="space-children-x">
      <button className="button" onClick={applyBrush}>
        apply
      </button>
      <button className="button" onClick={undo}>
        undo
      </button>
      <button className="button" onClick={reset}>
        reset
      </button>
    </Controls>
  )
}

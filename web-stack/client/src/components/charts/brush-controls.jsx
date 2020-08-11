import React from 'react'
import styled from '@emotion/styled'

const Controls = styled.div`
  display: flex;
  justify-content: center;
`

export default ({ applyBrush, undo, reset, changeTool, tool }) => {
  // const otherTool = tool === 'brush' ? 'zoom' : 'brush'

  return (
    <Controls className="space-children-x">
      {tool === 'brush' ? (
        <button className="button" onClick={applyBrush}>
          apply
        </button>
      ) : null}
      <button className="button" onClick={undo}>
        undo
      </button>
      {/* <button className="button" onClick={() => changeTool(otherTool)}>
          switch to {otherTool}
        </button> */}
      <button className="button" onClick={reset}>
        reset
      </button>
    </Controls>
  )
}

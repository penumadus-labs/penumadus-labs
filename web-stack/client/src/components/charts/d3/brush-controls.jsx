import React from 'react'
import styled from '@emotion/styled'
import Alert, { useAlert } from '../../alerts/alert'

const Controls = styled.div`
  display: flex;
  justify-content: center;
`

export default ({ applyBrush, undo, reset, setTool, tool }) => {
  // const otherTool = tool === 'brush' ? 'zoom' : 'brush'
  const [open, bind] = useAlert()

  return (
    <>
      <Controls className="space-children-x">
        {tool === 'brush' ? (
          <button className="button" onClick={applyBrush}>
            apply
          </button>
        ) : null}
        <button className="button" onClick={undo}>
          undo
        </button>
        {/* <button className="button" onClick={() => setTool(otherTool)}>
        switch to {otherTool}
      </button> */}
        <button className="button" onClick={reset}>
          reset
        </button>
        <button className="button" onClick={open}>
          help
        </button>
      </Controls>
      <Alert {...bind}>
        <p>click and drag to select an area of the chart</p>
        <p>use apply to expand that area</p>
        <p>use undo to return to previous action</p>
        <p>use reset to return to default view</p>
        <p>use the gear to change the display and download the display</p>
      </Alert>
    </>
  )
}

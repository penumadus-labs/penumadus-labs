import { AxisBottom } from '@visx/axis'
import { Brush as VisxBrush } from '@visx/brush'
import React from 'react'
import { brushHeight, yScaleBrush } from './helpers/size'

export const Brush = ({ onClick, onChange, innerWidth, scale }) => {
  return (
    <>
      <VisxBrush
        xScale={scale}
        yScale={yScaleBrush}
        width={innerWidth}
        height={brushHeight}
        // handleSize={8}
        resizeTriggerAreas={['left', 'right']}
        brushDirection="horizontal"
        initialBrushPosition={{ start: { y: 0 }, end: { y: 100 } }}
        onChange={onChange}
        onClick={onClick}
        selectedBoxStyle={{ fill: 'rgb(50, 150, 250, .1)' }}
      />
      <AxisBottom
        top={brushHeight}
        axisClassName="axis"
        label="time"
        scale={scale}
      />
    </>
  )
}

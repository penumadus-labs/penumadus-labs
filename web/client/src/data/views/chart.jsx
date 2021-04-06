import styled from '@emotion/styled'
import { Group } from '@visx/group'
import React from 'react'
import { margin } from '../model/size'
import { Brush } from './brush'
import { ParentSize } from '@visx/responsive'

const StyledSvg = styled.svg`
  text {
    fill: var(--font);
  }

  .line {
    stroke: var(--font);
  }

  .axis {
    path,
    line {
      stroke: var(--font);
    }
  }
`

const ChartContent = ({ width, height, reducer }) => {
  const [
    {
      live,
      size: { innerWidth },
      view: { View },
      brush: { groupTop, scaleBrush },
    },
    { handleReset, handleBrush },
    { useMount },
  ] = reducer

  useMount(width, height)

  if (!View) return null

  return (
    <StyledSvg height={height} width={width}>
      <Group left={margin.left} top={margin.top}>
        <line className="line" y1="0" y2="0" x1="0" x2={innerWidth} />
        {settings.map(({ stroke, accessor, scale }, i) => {
          return (
            <LinePath
              key={i}
              stroke={stroke}
              strokeWidth={2}
              data={data}
              x={(d) => xScale(accessTime(d))}
              y={(d) => scale(accessor(d))}
              defined={isDefined}
            />
          )
        })}
        <AxisBottom
          top={chartHeight}
          axisClassName="axis"
          label="time"
          scale={xScale}
        />
        <AxisLeft axisClassName="axis" label="temperature" scale={scaleLeft} />,
        <AxisRight
          axisClassName="axis"
          label="temp"
          scale={scaleRight}
          left={innerWidth}
        />
      </Group>
      <Group left={margin.left} top={groupTop}>
        {!live && (
          <Brush
            onChange={handleBrush}
            onClick={handleReset}
            scale={scaleBrush}
            innerWidth={innerWidth}
          />
        )}
      </Group>
    </StyledSvg>
  )
}

export const Chart = ({ reducer }) => (
  <ParentSize debounceTime={10000}>
    {({ width, height }) => (
      <ChartContent width={width} height={height} reducer={reducer} />
    )}
  </ParentSize>
)

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
        <View />
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

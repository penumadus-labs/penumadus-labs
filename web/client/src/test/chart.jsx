import styled from '@emotion/styled'
import { Group } from '@visx/group'
import React from 'react'
import { margin } from './helpers/size'
import { useChartReducer } from './helpers/reducer'
import { Brush } from './brush'

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

export const Chart = (props) => {
  const { width, height } = props
  const [
    {
      size: { innerWidth },
      view,
      brush: { groupTop, scaleBrush },
    },
    { handleReset, handleBrush },
  ] = useChartReducer(props)

  if (!view) return null

  return (
    <StyledSvg height={height} width={width}>
      <Group left={margin.left} top={margin.top}>
        <line className="line" y1="0" y2="0" x1="0" x2={innerWidth} />
        {view}
      </Group>
      <Group left={margin.left} top={groupTop}>
        <Brush
          onChange={handleBrush}
          onClick={handleReset}
          scale={scaleBrush}
          innerWidth={innerWidth}
        />
      </Group>
    </StyledSvg>
  )
}

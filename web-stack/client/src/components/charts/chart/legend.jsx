import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { colors, units } from '../utils/units-colors'

const StyledList = styled.ul`
  display: flex;
  justify-content: center;
`

const StyledItem = styled.li`
  color: ${(props) => props.color};
`

export default ({ labels }) => {
  return (
    <StyledList className="space-children-x">
      {useMemo(
        () =>
          labels.map((label, i) => (
            <StyledItem x={i * 100} key={i} color={colors[label]}>
              {`${label} (${units[label]})`}
            </StyledItem>
          )),
        [labels]
      )}
    </StyledList>
  )
}

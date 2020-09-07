import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { colors, units } from '../units-colors'

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
          // console.log('labels') ||
          labels.map((label, i) => (
            <StyledItem x={i * 100} key={i} color={colors[label]}>
              {`${label} (${units[label]})`}
            </StyledItem>
          )),
        // eslint-disable-next-line
        []
      )}
    </StyledList>
  )
}

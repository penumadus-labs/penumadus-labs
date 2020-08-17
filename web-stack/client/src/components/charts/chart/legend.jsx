import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { colors, units } from '../units-colors'

const StyledList = styled.ul`
  display: flex;
  justify-content: center;
`

const StyledItem = styled.li`
  color: ${(props) => props.color};
`

export default ({ labels }) => {
  const res = useMemo(
    () =>
      labels.map((label, i) => (
        <StyledItem x={i * 100} key={i} color={colors[label]}>
          {`${label} (${units[label]})`}
        </StyledItem>
      )),
    // eslint-disable-next-line
    []
  )

  return <StyledList className="space-children-x">{res}</StyledList>
}

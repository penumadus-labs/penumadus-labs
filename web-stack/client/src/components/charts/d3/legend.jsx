import React from 'react'
import styled from '@emotion/styled'

const StyledList = styled.ul`
  display: flex;
  justify-content: center;
`

const StyledItem = styled.li`
  color: ${(props) => props.color};
`

export default ({ labels, colors, units }) => {
  return (
    <StyledList className="space-children-x">
      {labels.map((label, i) => (
        <StyledItem x={i * 100} key={i} color={colors[label]}>
          {`${label} (${units[label]})`}
        </StyledItem>
      ))}
    </StyledList>
  )
}
